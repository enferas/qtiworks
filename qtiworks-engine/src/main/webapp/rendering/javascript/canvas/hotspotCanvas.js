/* 
 Document   : hotspotCanvas.js
 Created on : Sep 29, 2015, 11:03:20 AM
 Author     : Cosette Danbar
 Description:
 hotspotCanvas js.
 */


var HotspotCanvas = (function() {
    var canvas;
    var stage;
    var preloader;
    var manifest;
    var objects = [];
    var buttons = [];

    var canvasSize = {h: 0, w: 0};
    var backgroundSrc = '';
    var choicesCount;
    var choicesArr = [];
    var choicesObjectsArr = [];
    var textArr = [];
    var imagesArr = [];
    var choicesShift;
    var ImageObject = {img: "", posx: 0, posy: 0};
    var ChoicesContainer = new createjs.Container();

    var userAnswerArr = [];
    var recsArr = [];
    var responseIdentifier;
    var maxAssociations, minAssociations;
    var divContainerQuery;
    var previousSubmission;


    function createCanvas(resIdentifier)
    {
        var canvas = document.createElement('canvas');
        canvas.width = canvasSize.w;
        canvas.height = canvasSize.h;
        divContainerQuery.appendChild(canvas);
        return canvas;

    }
    function init(containerId, resIdentifier, max, min, width, height, backgroundImage, hotspots, prevSubmission)
    {

        canvasSize.w = width;
        canvasSize.h = height;
        divContainerQuery = document.getElementById(containerId);
        canvas = createCanvas(resIdentifier);
        stage = new createjs.Stage(canvas);
        prepareApp(stage, canvas, canvasSize);
        createjs.Touch.enable(stage);
        stage.mouseMoveOutside = true; // keep tracking the mouse even

        previousSubmission = prevSubmission;
        responseIdentifier = resIdentifier;
        backgroundSrc = backgroundImage;
        maxAssociations = max;
        minAssociations = min;
        choicesCount = hotspots.length;
        choicesArr = hotspots;
        createjs.Ticker.addEventListener("tick", tick);
        setInitialState();
    }

    function setInitialState()
    {
        if (backgroundSrc !== '')
        {
            objects["background"] = new createjs.Bitmap(backgroundSrc);
            stage.addChild(objects["background"]);
            objects["background"].set({x: 0, y: 0, alpha: 1});


        }
        stage.addChild(ChoicesContainer);
        choicesShift = 360 / choicesCount;
        var num = (canvasSize.h / 2) / (Math.round(choicesCount / 4));

        var width = canvasSize.w / choicesCount;
        var height = 20;
        var fontSize = width / 3;

        for (var i = 0; i < choicesCount; i++)
        {
            var w = (choicesArr[i].label.length / 2) * fontSize;
            var rec = new createjs.Shape();
            var arr = choicesArr[i].coords.split(",");
            if (choicesArr[i].shape === 'circle')
            {
                rec.graphics.beginFill("#ff0000").drawCircle(0, 0, arr[2]);
            }

            rec.alpha = 0.01;
            rec.x = arr[0];
            rec.y = arr[1];
            recsArr[i] = rec;
            ChoicesContainer.addChild(rec);
            rec.identifier = choicesArr[i].identifier;
            rec.name = choicesArr[i].name;
            rec.matched = [];
            rec.rec = rec;
            rec.clicked = false;
            rec.onPress = startInteraction;
        }
        if (previousSubmission !== '')
        {
            drawPreviousSubmission(previousSubmission);
        }


    }

    function preloaderManager()
    {

        manifest = [
            // background
            {src: backgroundSrc, id: "background", class: "bitmap"}
        ];

        preload = new createjs.LoadQueue(false);
        preload.installPlugin(createjs.Sound);
        preload.addEventListener("fileload", handleLoadComplete);
        preload.addEventListener("complete", handleComplete);
        preload.loadManifest(manifest);
    }

    function handleFileLoad(event)
    {
        img = new Image();
        img.onload = handleLoadComplete;
        img.src = event.item.src;
        img.id = event.item.id;
    }

    function handleLoadComplete(event)
    {
        switch (event.item.class)
        {
            case "bitmap":
                {

                    objects[event.item.id] = new
                            createjs.Bitmap(event.item.src);
                    objects[event.item.id].alpha = 0;

                    break;
                }
            case "bitmapAnimation":
                {
                    var data = {
                        images: [event.item.src],
                        frames: {width: event.item.width, height:
                                    event.item.height},
                        animations: event.item.animations
                    };
                    var spriteSheet = new createjs.SpriteSheet(data);
                    objects[event.item.id] = new
                            createjs.BitmapAnimation(spriteSheet);
                    objects[event.item.id].alpha = 0;
                    break;
                }
            case "button":
                {
                    if (event.item.id === "circleBtn")
                    {
                        for (var i = 0; i < column1Num + column2Num; i++)
                        {
                            var data = {
                                images: [event.item.src],
                                frames: {width: event.item.tag.width / event.item.framesNum, height: event.item.tag.height},
                                animations: {normal: 0, hover: 1, clicked: 1, disabled: 0}
                            };
                            var spriteSheet = new createjs.SpriteSheet(data);
                            objects[event.item.id] = new
                                    createjs.BitmapAnimation(spriteSheet);
                            buttons[event.item.id] = new
                                    createjs.ButtonHelper(objects[event.item.id], "normal", "hover",
                                            "clicked", false);
                            circleWidth = event.item.tag.width / event.item.framesNum;
                            circleHeight = event.item.tag.height;
                            objects[event.item.id].name = event.item.id + i;
                            objects[event.item.id].alpha = 0;
                            objects[event.item.id].btn = buttons[event.item.id];
                            circlesArr[i] = objects[event.item.id];
                        }

                        break;
                    }
                    else
                    {
                        var data = {
                            images: [event.item.src],
                            frames: {width: event.item.tag.width / event.item.framesNum, height: event.item.tag.height},
                            animations: {normal: 0, hover: 1, clicked: 2, disabled: 3}
                        };
                        var spriteSheet = new createjs.SpriteSheet(data);
                        objects[event.item.id] = new
                                createjs.BitmapAnimation(spriteSheet);
                        buttons[event.item.id] = new
                                createjs.ButtonHelper(objects[event.item.id], "normal", "hover",
                                        "clicked", false);
                        objects[event.item.id].alpha = 0;

                        break;
                    }
                }
        }
    }

    function handleComplete()
    {


        stage.addChild(lineContainer, ChoicesContainer);
        createjs.Ticker.addEventListener("tick", tick);
        setInitialState();

    }

    function tick()
    {
        stage.update();
    }

    function startInteraction(e)
    {

        if (e.target.rec.clicked == true)
        {
            e.target.rec.alpha = 0.01;
            e.target.rec.clicked = false;
            userAnswerArr.pop(e.target.rec.identifier);

        }
        else
        {
            e.target.rec.alpha = 0.8;
            e.target.rec.clicked = true;
            userAnswerArr.push(e.target.rec.identifier);

        }
checkEnbled();
        createHiddenFormFields();

    }
    function checkEnbled()
    {
        if (userAnswerArr.length == maxAssociations)
        {
            for (var i = 0; i < recsArr.length; i++)
            {
                if (recsArr[i].clicked == false)
                {
                    recsArr[i].mouseEnabled = false;
                }
            }

        }
        else
        {
            for (var i = 0; i < recsArr.length; i++)
            {
                if (recsArr[i].clicked == false)
                {
                    recsArr[i].mouseEnabled = true;
                }
            }
        }
    }
    function  drawPreviousSubmission(previousSubmission)
    {
        userAnswerArr=[];
        var pairArr = previousSubmission.split(",");
        for (var i = 0; i < pairArr.length; i++)
        {
            var pair = pairArr[i];
            var rec = getRecById(pair);
            rec.alpha = 0.8;
            rec.clicked = true;
            userAnswerArr.push(rec.identifier);
        }
        checkEnbled();
        createHiddenFormFields();
    }

    function getRecById(id)
    {
        for (var i = 0; i < recsArr.length; i++)
        {
            if (recsArr[i].identifier === id)
            {
                return recsArr[i];
            }
        }
    }

    function resetCanvas()
    {
        ChoicesContainer.removeAllChildren();
        setInitialState();
    }

    function createResponsePairs()
    {
        userAnswerArr = [];
        for (var i = 0; i < choicesCount; i++)
        {
            var choicePair = [];
            for (var k = 0; k < recsArr[i].matched.length; k++)
            {
                choicePair.push(recsArr[i].identifier + " " + recsArr[i].matched[k]);

            }
            userAnswerArr[i] = choicePair;
        }
        createHiddenFormFields();
    }

    var values = [];
    function setValuesArr()
    {
        values = [];
        for (var i = 0; i < userAnswerArr.length; i++)
        {
            values.push(userAnswerArr[i]);

        }

    }


    function createHiddenFormFields()
    {
        setValuesArr();
        $(divContainerQuery).find('input').remove();
        for (var i = 0; i < values.length; i++) {

            var inputElement = $('<input type="hidden">');
            inputElement.attr('name', 'qtiworks_response_' + responseIdentifier);
            inputElement.attr('value', values[i]);
            $(divContainerQuery).append(inputElement);
        }
    }


    return {
        initialize: function(containerId, resIdentifier, max, min, width, height, backgroundImage, hotspots, previousSubmission) {
            init(containerId, resIdentifier, max, min, width, height, backgroundImage, hotspots, previousSubmission);
        },
        syncHiddenFormFields: function() {
            createHiddenFormFields();
        },
        reset: function() {
            resetCanvas();
        }
    }

})();
