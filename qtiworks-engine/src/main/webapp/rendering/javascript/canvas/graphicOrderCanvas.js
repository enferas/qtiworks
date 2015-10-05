/* 
 Document   : GraphicOrder.js
 Created on : Oct 4, 2015, 10:05:20 AM
 Author     : Cosette Danbar
 Description:
 GraphicOrderCanvas js.
 */

var GraphicOrderCanvas = (function() {
    var canvas;
    var stage;
    var objects = [];
    var buttons = [];
    var canvasSize = {h: 0, w: 0};
    var backgroundSrc = '';
    var choicesCount;
    var choicesArr = [];
    var choicesObjectsArr = [];
    var textArr = [];
    var imagesArr = [];
    var ChoicesContainer = new createjs.Container();
    var userAnswerArr = [];
    var recsArr = [];
    var orderRecsArr = [];
    var responseIdentifier;
    var divContainerQuery;
    var previousSubmission;
    var shiftY;
    var XArr = [];
    var YArr = [];
    function createCanvas(resIdentifier)
    {
        var canvas = document.createElement('canvas');
        canvas.width = canvasSize.w;
        canvas.height = canvasSize.h;
        divContainerQuery.appendChild(canvas);
        return canvas;

    }
    function init(containerId, resIdentifier, width, height, backgroundImage, hotspots, prevSubmission)
    {

        canvasSize.w = width;
        canvasSize.h = height + 70;
        divContainerQuery = document.getElementById(containerId);
        canvas = createCanvas(resIdentifier);
        stage = new createjs.Stage(canvas);
        setStage(stage);
        prepareApp(stage, canvas, canvasSize);
        createjs.Touch.enable(stage);
        stage.mouseMoveOutside = true; // keep tracking the mouse even

        previousSubmission = prevSubmission;
        responseIdentifier = resIdentifier;
        backgroundSrc = backgroundImage;
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
            var orderContainer = new createjs.Container();
            var w = (choicesArr[i].label.length / 2) * fontSize;
            var rec = new createjs.Shape();
            var orderRec = new createjs.Shape();
            var arr = choicesArr[i].coords.split(",");
            var shiftX = 0;

            if (choicesArr[i].shape === 'circle')
            {
                rec.graphics.beginFill("#ff0000").drawCircle(0, 0, arr[2]);
            }

            if (choicesArr[i].shape === 'circle')
            {
                orderRec.graphics.beginFill("#ff0000").drawCircle(0, 0, arr[2]);
                shiftX = (arr[2] * 2) + 10;
                shiftY = arr[2];

            }

            rec.alpha = 0.01;
            rec.x = arr[0];
            rec.y = arr[1];

            orderRec.x = 20 + i * shiftX;
            orderRec.y = canvasSize.h - 50;
            XArr[i] = orderRec.x;
            YArr[i] = orderRec.y;
            var qText = new createjs.Text('', 15 + "px myfont", "#000000");
            qText.text = i + 1;
            qText.textAlign = "center";
            qText.set({x: orderRec.x, y: orderRec.y, alpha: 1});
            qText.x = orderRec.x;
            qText.y = orderRec.y - shiftY;
            orderContainer.orderRec = orderRec;
            orderContainer.txt = qText;
            orderContainer.putted = "false";
            recsArr[i] = rec;
            rec.orderObj = null;
            orderContainer.recObj = null;

            orderContainer.addChild(orderRec, qText);
            orderContainer.order = i + 1;
            orderRecsArr[i] = orderContainer;
            rec.enableDropping("rec", null, true, putOrder, null);
            orderContainer.enableDragging("rec", startDrag, null, null, onRevertDraggable);
            ChoicesContainer.addChild(rec, orderContainer);
            rec.identifier = choicesArr[i].identifier;
            rec.name = choicesArr[i].name;
            rec.matched = [];
            rec.rec = rec;
            rec.clicked = false;
        }

        if (previousSubmission !== '')
        {
            drawPreviousSubmission(previousSubmission);
        }


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


        stage.addChild(ChoicesContainer);
        createjs.Ticker.addEventListener("tick", tick);
        setInitialState();

    }

    function tick()
    {
        stage.update();
    }

    var currentDraggedObj;
    var currentDroppedObj;

    function startDrag()
    {
        currentDraggedObj = this;

    }

    function onRevertDraggable()
    {
        currentDraggedObj = this;
        if (currentDraggedObj.recObj != null)
        {

            currentDraggedObj.x = 0;
            currentDraggedObj.y = 0;
            currentDraggedObj.txt.x = XArr[currentDraggedObj.order - 1];
            currentDraggedObj.txt.y = YArr[currentDraggedObj.order - 1] - shiftY;
            currentDraggedObj.orderRec.x = XArr[currentDraggedObj.order - 1];
            currentDraggedObj.orderRec.y = YArr[currentDraggedObj.order - 1];
            currentDraggedObj.recObj.orderObj = null;
            currentDraggedObj.recObj = null;


        }
        else
        {
            createjs.Tween.get(this).to({x: this.originalX, y: this.originalY}, 300, createjs.Ease.backOut);
        }
        createHiddenFormFields();

    }

    function putOrder()
    {
        currentDroppedObj = this;
        if (currentDraggedObj.recObj != null)
        {
            currentDraggedObj.recObj.orderObj = null;
        }
        if (currentDroppedObj.orderObj != null)
        {

            currentDroppedObj.orderObj.x = 0;
            currentDroppedObj.orderObj.y = 0;
            currentDroppedObj.orderObj.txt.x = XArr[currentDroppedObj.orderObj.order - 1];
            currentDroppedObj.orderObj.txt.y = YArr[currentDroppedObj.orderObj.order - 1] - shiftY;
            currentDroppedObj.orderObj.orderRec.x = XArr[currentDroppedObj.orderObj.order - 1];
            currentDroppedObj.orderObj.orderRec.y = YArr[currentDroppedObj.orderObj.order - 1];


            currentDroppedObj.orderObj = null;
        }
        currentDroppedObj.orderObj = currentDraggedObj;
        currentDraggedObj.recObj = currentDroppedObj;
        currentDraggedObj.x = 0;
        currentDraggedObj.y = 0;
        currentDraggedObj.txt.x = this.x;
        currentDraggedObj.txt.y = this.y - shiftY;
        currentDraggedObj.orderRec.x = this.x;
        currentDraggedObj.orderRec.y = this.y;
        createHiddenFormFields();

    }


    function  drawPreviousSubmission(previousSubmission)
    {
        userAnswerArr = [];
        var pairArr = previousSubmission.split(",");
        for (var i = 0; i < pairArr.length; i++)
        {
            var pair = pairArr[i];
            var rec = getRecById(pair);
            orderRecsArr[i].txt.x = rec.x;
            orderRecsArr[i].txt.y = rec.y - shiftY;

            orderRecsArr[i].orderRec.x = rec.x;
            orderRecsArr[i].orderRec.y = rec.y;
            rec.orderObj = orderRecsArr[i];
            orderRecsArr[i].recObj = rec;
        }

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



    var values = [];
    function setValuesArr()
    {
        values = [];
        for (var i = 0; i < recsArr.length; i++)
        {
            if (recsArr[i].orderObj != null)
            {
                values[recsArr[i].orderObj.order - 1] = recsArr[i].identifier;
            }


        }

    }


    function createHiddenFormFields()
    {
        setValuesArr();
        $(divContainerQuery).find('input').remove();
        for (var i = 0; i < values.length; i++) {
            if (values[i])
            {
                var inputElement = $('<input type="hidden">');
                inputElement.attr('name', 'qtiworks_response_' + responseIdentifier);
                inputElement.attr('value', values[i]);
                $(divContainerQuery).append(inputElement);
            }

        }
        
    }
    function isAllOrderd()
    {
        var counter = 0;
        setValuesArr();
        for (var i = 0; i < values.length; i++) {
            if (values[i])
            {
                counter++;
            }

        }
        if (counter == choicesCount)
        {
            return true;
        }
        return false;
    }


    return {
        initialize: function(containerId, responseIdentifier, width, height, backgroundImage, hotspots, previousSubmission) {
            init(containerId, responseIdentifier, width, height, backgroundImage, hotspots, previousSubmission);
        },
        isAllOrderd: function() {
            return isAllOrderd();
        },
        syncHiddenFormFields: function() {
            createHiddenFormFields();
        },
        reset: function( ) {
            resetCanvas();
        }
    }

})();
