/* 
 Document   : associationCanvas.js
 Created on : Sep 09, 2015, 09:08:43 AM
 Author     : Cosette Danbar
 Description:
 associateCanvas js.
 */

var AssociationCanvas = (function() {
    var canvas;
    var stage;
    var preloader;
    var manifest;
    var objects = [];
    var buttons = [];

    var canvasSize = {h: 0, w: 0};
    var backgroundSrc = 'Artwork.png';
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
    var lineColor = "#000000";
    var lineContainer = new createjs.Container();
    var r;
    var responseIdentifier;
    var maxAssociations, minAssociations;
    var divContainerQuery;
    var previousSubmission;
    function craeteCanvas(resIdentifier)
    {
        var canvas = document.createElement('canvas');
        canvas.width = 360;
        canvas.height = 360;
//        canvas.style.zIndex = 8;
//        canvas.style.position = "absolute";
//        canvas.style.border = "1px solid";
        canvasSize.h = 360;
        canvasSize.w = 360;
        divContainerQuery.appendChild(canvas);
        return canvas;

    }
    function init(containerId, resIdentifier, max, min, choices, prevSubmission)
    {
        divContainerQuery = document.getElementById(containerId);
        canvas = craeteCanvas(resIdentifier);
        stage = new createjs.Stage(canvas);
        prepareApp(stage, canvas, canvasSize);
        createjs.Touch.enable(stage);
//    stage.enableMouseOver(10);
        stage.mouseMoveOutside = true; // keep tracking the mouse even

        previousSubmission = prevSubmission;
        responseIdentifier = resIdentifier;
        maxAssociations = max;
        minAssociations = min;
        choicesCount = choices.length;
        choicesArr = choices;

        setInitialState();


        // Listen for orientation changes
        window.addEventListener("orientationchange", function() {
            // Announce the new orientation number
            prepareApp(stage, canvas, canvasSize);
            stage.update();
        }, true);
        // Listen for resize changes
        window.addEventListener("resize", function() {
            // Get screen size (inner/outerWidth, inner/outerHeight)
            prepareApp(stage, canvas, canvasSize);
            stage.update();
        }, true);
        preloaderManager();
    }

    function setInitialState()
    {

        r = canvasSize.h / 2;
        choicesShift = 360 / choicesCount;
        var num = (canvasSize.h / 2) / (Math.round(choicesCount / 4));

        ChoicesContainer.regX = -r;
        ChoicesContainer.regY = -r;
        var width = canvasSize.w / choicesCount;
        var height = 20;
        var fontSize = width / 3;

        for (var i = 0; i < choicesCount; i++)
        {
            var w = (choicesArr[i].content.length / 2) * fontSize;
            var rec = new createjs.Shape();
            rec.min = choicesArr[i].matchMin;
            rec.max = choicesArr[i].matchMax;
            if (choicesArr[i].max == -1)
            {
                rec.max = choicesCount - 1;
            }
            rec.identifier = choicesArr[i].identifier;
            rec.name = choicesArr[i].name;
            rec.matched = [];
            rec.rec = rec;
            rec.onPress = startMatch;

            var newX = 0 + r * Math.cos(2 * Math.PI * i / choicesCount);
            var newY = 0 + r * Math.sin(2 * Math.PI * i / choicesCount);
            if (newX >= r)
            {
                newX = -w + newX;
            }
            rec.x = w / 2 + newX;
            if (newY >= 0)
            {
                rec.y = newY - height / 2;
            }
            else
            {
                rec.y = newY + height / 2;
            }
            recsArr[i] = rec;
            ChoicesContainer.addChild(rec);


            if (choicesArr[i].image !== '')
            {
                var img = choicesArr[i].image;
                var image = new Image();
                image.src = choicesArr[i].image;
                image.index = i;
                image.newY = newY;
                image.newX = newX;
                image.rec = rec;
                image.w = w;
                image.h = height;
                image.onload = function(evt) {
                    var index = evt.target.index;
                    objects[img + index] = new createjs.Bitmap(evt.target);
                    objects[img + index ].name = img + index;
                    var imgWidth = objects[img + index ].image.width;
                    var imgHeight = objects[img + index ].image.height;
                    var sx = 50 / imgWidth;
                    var sy = 50 / imgHeight;
                    objects[img + index].scaleX = sx;
                    objects[img + index].scaleY = sy;
                    var recW = evt.target.w;
                    if (width * sx > evt.target.w)
                    {
                        recW = width * sx;
                    }
                    var recH = evt.target.h + imgHeight * sy;
                    evt.target.rec.graphics.beginFill("#f1f1f1").drawRect(0, 0, recW, recH);
                    evt.target.rec.regX = recW / 2;
                    evt.target.rec.regY = recH / 2;
                    evt.target.rec.x = recW / 2 + evt.target.newX;
                    if (evt.target.newY >= 0)
                    {
                        evt.target.rec.y = evt.target.newY - recH / 2;
                    }
                    else
                    {
                        evt.target.rec.y = evt.target.newY + recH / 2;
                    }

                    if (choicesArr[index].content !== '')
                    {
                        var qText = new createjs.Text(choicesArr[index].content, fontSize + "px myfont", "#000000");
                        qText.text = choicesArr[index].content;
                        qText.textAlign = "center";
                        qText.set({x: 0, y: 0, alpha: 1});
                        qText.rec = evt.target.rec;
                        qText.x = evt.target.rec.x;
                        qText.y = evt.target.rec.y - recH / 2;
                        ChoicesContainer.addChild(qText);
                    }
                    objects[img + index].regX = imgWidth * sx / 2;
                    objects[img + index].regY = imgHeight * sy / 2;
                    objects[img + index].set({x: evt.target.rec.x - imgWidth * sx / 2, y: evt.target.rec.y - imgHeight * sy / 4, alpha: 1});

                    objects[img + index].rec = evt.target.rec;


                    if (evt.target.newX >= r)
                    {
                        evt.target.newX = -evt.target.w + evt.target.newX;
                    }

                    ChoicesContainer.addChild(objects[img + index]);
                    stage.update();
                };

            }
            else
            {
                rec.graphics.beginFill("#f1f1f1").drawRect(0, 0, w, height);
                rec.regX = w / 2;
                rec.regY = height / 2;
                recsArr[i] = rec;
                ChoicesContainer.addChild(rec);
                if (choicesArr[i].content !== '')
                {
                    var qText = new createjs.Text(choicesArr[i].content, fontSize + "px myfont", "#000000");
                    qText.text = choicesArr[i].content;
                    qText.textAlign = "center";
                    qText.set({x: 0, y: 0, alpha: 1});
                    qText.rec = rec;
                    qText.x = rec.x;
                    qText.y = rec.y- height/2;
                    ChoicesContainer.addChild(qText);

                }
            }

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

    }

    function tick()
    {
        stage.update();
    }

    function startMatch(e)
    {
        x1 = e.target.x;
        y1 = e.target.y;
        console.log(x1);
        console.log(y1);
        var s = new createjs.Shape();
        s.graphics.setStrokeStyle(2).beginStroke(lineColor).
                moveTo(x1 + r, y1 + r);
        lineContainer.addChild(s);
        e.onMouseMove = function(ev)
        {
            s.graphics.clear();
            s.graphics.setStrokeStyle(2).beginStroke(lineColor).
                    moveTo(x1 + r, y1 + r).lineTo(stage.mouseX, stage.mouseY);

        }

        e.onMouseUp = function(ev)
        {

            var objectsUnderMouse = stage.getObjectsUnderPoint(stage.mouseX, stage.mouseY);

            matched = false;
            for (var i = 0; i < ChoicesContainer.getNumChildren(); i++)
            {

                if (objectsUnderMouse.contains(ChoicesContainer.getChildAt(i)))
                {

                    if (!(e.target.rec.matched.contains(ChoicesContainer.getChildAt(i).rec.identifier))
                            && (ChoicesContainer.getChildAt(i).rec.identifier !== e.target.rec.identifier)
                            && (!(ChoicesContainer.getChildAt(i).rec.matched.contains(e.target.rec.identifier))))

                    {

                        s.graphics.clear();
                        s.graphics.setStrokeStyle(2).beginStroke(lineColor).
                                moveTo(x1 + r, y1 + r).lineTo(ChoicesContainer.getChildAt(i).x + r, ChoicesContainer.getChildAt(i).y + r);

                        (e.target.rec.matched).push(ChoicesContainer.getChildAt(i).rec.identifier);
                        (ChoicesContainer.getChildAt(i).rec.matched).push(e.target.rec.identifier);
                        if (e.target.rec.matched.length == e.target.rec.max)
                        {
                            e.target.rec.mouseEnbaled = false;
                        }
                        s.rec1 = e.target.rec;
                        s.rec2 = ChoicesContainer.getChildAt(i).rec;
                        matched = true;
                        s.onPress = removeLine;
                        createResponsePairs();
                        e = null;
                        return;
                    }
                }
            }
            if (!matched)
            {
                e = null;
                s.graphics.clear();
                return;


            }

        }
    }


    function  drawPreviousSubmission(previousSubmission)
    {
        var pairArr = previousSubmission.split(",");
        for (var i = 0; i < pairArr.length; i++)
        {
            var pair = pairArr[i];
            var arr =pair.split(" ");
            var rec1 = getRecById(arr[0]);
            var rec2 = getRecById(arr[1]);

            var s = new createjs.Shape();
            lineContainer.addChild(s);
            s.graphics.setStrokeStyle(2).beginStroke(lineColor).
                    moveTo(rec1.x + r, rec1.y + r).lineTo(rec2.x + r, rec2.y + r);

            (rec1.matched).push(rec2.identifier);
            (rec2.matched).push(rec1.identifier);
            if (rec1.matched.length == rec1.max)
            {
                rec1.mouseEnbaled = false;
            }
            s.rec1 = rec1;
            s.rec2 = rec2;
            matched = true;
            s.onPress = removeLine;
            createResponsePairs();

        }
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

    function removeLine(ev)
    {
        ev.target.rec1.matched.splice(ev.target.rec1.matched.indexOf(ev.target.rec2.identifier), 1);
        ev.target.rec2.matched.splice(ev.target.rec2.matched.indexOf(ev.target.rec1.identifier), 1);
        ev.target.graphics.clear();
        createResponsePairs();

    }

    function resetCanvas()
    {
        lineContainer.removeAllChildren();
        ChoicesContainer.removeAllChildren();
        previousSubmission = '';
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
            if (userAnswerArr[i].length > 0)
            {
                for (var k = 0; k < userAnswerArr[i].length; k++)
                {
                    if (userAnswerArr[i][k] !== '')
                    {
                        values.push(userAnswerArr[i][k]);
                        removePair(userAnswerArr[i][k]);
                    }

                }

            }
        }

    }

    function removePair(pair)
    {
        var tempPair = '';
        var arr=pair.split(" ");
        tempPair = arr[1] + " " + arr[0];
        for (var i = 0; i < userAnswerArr.length; i++)
        {
            if (userAnswerArr[i].length > 0)
            {
                for (var k = 0; k < userAnswerArr[i].length; k++)
                {
                    if (userAnswerArr[i][k] === tempPair)
                    {
                        userAnswerArr[i][k] = '';
                    }
                }

            }
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
        initialize: function(containerId, resIdentifier, max, min, choices, previousSubmission) {
            init(containerId, resIdentifier, max, min, choices, previousSubmission);
        },
        syncHiddenFormFields: function() {
            createHiddenFormFields();
        },
        reset: function( ) {
            resetCanvas();
        }
    }

})();