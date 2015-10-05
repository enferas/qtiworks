/* 
 Document   : canvasUtilities.js
 Created on : Sep 09, 2015, 09:08:43 AM
 Author     : Cosette Danbar
 Description:
 canvasUtilities js.
 */

var Swidth = window.innerWidth;
var Sheight = window.innerHeight;
var Awidth =360;
var Aheight=360;
var wRatio = Swidth / Awidth;
var hRatio = Sheight / Aheight;
var stageScaleX;
var stageScaleY;
var adgustmentRatio = 1;
var SWCenter = Swidth / 2;
var SHCenter = Sheight / 2;
var AWCenter;
var AHCenter;

function prepareApp(StageName, CanvasName, canvasSize)
{
    Swidth = window.innerWidth;
    Sheight = window.innerHeight;
    Awidth =canvasSize.w;
    Aheight = canvasSize.h;
    wRatio = Swidth / Awidth;
    hRatio = Sheight / Aheight;
    stageScaleX;
    stageScaleY;
    adgustmentRatio = 1;
    SWCenter = Swidth / 2;
    SHCenter = Sheight / 2;

//    resizeCanvas();
//    setStageScale(StageName);
    initCanvas(CanvasName);
//    SetCenterPosition(CanvasName);
}

function setStageScale(StageName)
{
    StageName.scaleX = stageScaleX;
    StageName.scaleY = stageScaleY;
}

function initCanvas(canvasName)
{
    canvasName.width = Awidth;
    canvasName.height = Aheight;
}

function resizeCanvas()
{
    if (Sheight < Aheight && Swidth < Awidth)
    {
        Aheight = Aheight * hRatio;
        Awidth = Awidth * hRatio;

        if (Swidth < Awidth)
        {
            wRatio = Swidth / Awidth;

            Awidth = Awidth * wRatio * adgustmentRatio;
            Aheight = Aheight * wRatio * adgustmentRatio;

            stageScaleX = hRatio * wRatio * adgustmentRatio;
            stageScaleY = hRatio * wRatio * adgustmentRatio;
        }
        else {
            Aheight = Aheight * adgustmentRatio;
            Awidth = Awidth * adgustmentRatio;


            stageScaleX = hRatio * adgustmentRatio;
            stageScaleY = hRatio * adgustmentRatio;
        }

    }

    else if (Sheight < Aheight && Swidth > Awidth)

    {
        Aheight = Aheight * hRatio * adgustmentRatio;
        Awidth = Awidth * hRatio * adgustmentRatio;

        stageScaleX = hRatio * adgustmentRatio;
        stageScaleY = hRatio * adgustmentRatio;


    }
    else if (Sheight > Aheight && Swidth < Awidth)
    {
        Awidth = Awidth * wRatio * adgustmentRatio;
        Aheight = Aheight * wRatio * adgustmentRatio;

        stageScaleX = wRatio * adgustmentRatio;
        stageScaleY = wRatio * adgustmentRatio;


    }
    else if (Sheight >= Aheight && Swidth >= Awidth)
    {
        Awidth = Awidth * adgustmentRatio;
        Aheight = Aheight * adgustmentRatio;

        stageScaleX = adgustmentRatio;
        stageScaleY = adgustmentRatio;
    }


}

function SetCenterPosition(CanvasName)
{
    AWCenter = Awidth / 2;
    AHCenter = Aheight / 2;
    CanvasName.style.marginLeft = SWCenter - AWCenter + "px";
    // CanvasName.style.marginTop = SHCenter - AHCenter + "px";
}


// Utils

Array.prototype.shuffle = function() 
{
    var len = this.length;
    var i = len;
    while (i--) {
        var p = parseInt(Math.random() * len);
        var t = this[i];
        this[i] = this[p];
        this[p] = t;
    }
    return this;
};

Array.prototype.contains = function(obj) 
{
    var i = this.length;
    while (i--) {
        if (this[i] == obj) {
            return true;
        }
    }
    return false;
}

createjs.DisplayObject.prototype.setImage = function(Xpos, Ypos, Irotation, Ialpha, isEnabled)
{
    this.x = Xpos;
    this.y = Ypos;
    this.rotation = Irotation;
    this.alpha = Ialpha;
    this.mouseEnabled = isEnabled;

    return this;

};

function playSound(name)
{
    return createjs.Sound.play(name);
}

function stop()
{
    if (preload !== null)
    {
        preload.close();
    }
}

function tick()
{
    stage.update();
}

 createjs.ButtonHelper.prototype.setEnableBtn=function(btnBA, enabled)
{
    if (enabled)
    {
        btnBA.gotoAndPlay("normal");
        this.setEnabled(true);
        this.target.mouseEnabled = true;
    }
    else
    {
        btnBA.gotoAndPlay("disabled");
        this.setEnabled(false);
        this.target.mouseEnabled = false;
    }
}

createjs.ButtonHelper.prototype.enableBtn = function(frameOrAnimation)
{
    animations = this.target.spriteSheet.getAnimations();
    for (var i = 0; i < animations.length; i++) {
        if (animations[i] == frameOrAnimation) {
            this.target.gotoAndPlay(frameOrAnimation);
            break;
        }
    }
    this.setEnabled(true);
    this.target.mouseEnabled = true;
};

createjs.ButtonHelper.prototype.disableBtn = function(frameOrAnimation)
{
    animations = this.target.spriteSheet.getAnimations();
    for (var i = 0; i < animations.length; i++) {
        if (animations[i] == frameOrAnimation) {
            this.target.gotoAndPlay(frameOrAnimation);
            break;
        }
    }
    this.setEnabled(false);
    this.target.mouseEnabled = false;
};

// drag drop

var DnD_Registry = {};
var stage;
createjs.DisplayObject.prototype.isDraggable = false;
createjs.DisplayObject.prototype.isDroppable = false;
function setStage(_stage)
{
    stage=_stage;
}
createjs.DisplayObject.prototype.enableDragging =
        function(droppableOn, dragStarted, dragging, dragEnded, Revert) {
            (function(target) {
                target._dDragEnded = dragEnded;
                target._dDragStarted = dragStarted;
                target._dDragging = dragging;
                target._dRevert = Revert;
                target._dDroppableOn = droppableOn;
                target.isDraggable = true;
                target._dDroppables = {};
                target.mouseEnabled = true;
                target.cursor = "pointer";
                target._dUnderPress = false;

                // register draggable
                if (typeof(target._dType) != "function") {
                    if (!(target._dDroppableOn in DnD_Registry)) {
                        DnD_Registry[target._dDroppableOn] = [{}, {}];
                    }
                    DnD_Registry[target._dDroppableOn][0][target.id] = target;
                }
                else {
                    if (!("__func__" in DnD_Registry)) {
                        DnD_Registry["__func__"] = [{}, {}];
                    }
                    DnD_Registry[__func__][1][target.id] = target;
                }

                target.onPress = function(evt) {
                    
                    if(target._dUnderPress){
                        backup(evt);
                        return;
                    }
                    
                    target._dUnderPress = true;
                    
                    // On mouse down 
                    cmtx = target.parent.getConcatenatedMatrix();
                    transformedMouse = transformOriginalPoint(cmtx, stage.mouseX, stage.mouseY );
                    var objectsUnderMouse = stage.getObjectsUnderPoint(transformedMouse.x, transformedMouse.y);
                    for (var i = 0; i < objectsUnderMouse.length; i++) {
                        if ((objectsUnderMouse[i].isDroppable) && (objectsUnderMouse[i]._dContainedDraggable == target)) {
                            objectsUnderMouse[i]._dReleaseDraggable(target);
                            if (objectsUnderMouse[i]._dGreedy) {
                                break;
                            }
                        }
                    }
                    target.originalX = target.x;
                    target.originalY = target.y;
                    if (typeof(target._dDragStarted) == "function") {
                        target._dDragStarted();
                    }

                    cmtx = target.getConcatenatedMatrix();
                    var offset = {x: cmtx.tx - stage.mouseX, y: cmtx.ty - stage.mouseY};

                    // add a handler to the event object's onMouseMove callback
                    // this will be active until the user releases the mouse button:
                    evt.onMouseMove = function(ev) {
                        if(!target._dUnderPress){
                            return;
                        }
                        
                        cmtx = target.parent.getConcatenatedMatrix();
                        transformedMouse = transformOriginalPoint(cmtx, stage.mouseX + offset.x, stage.mouseY + offset.y);
                        target.x = transformedMouse.x + target.regX;
                        target.y = transformedMouse.y + target.regY;

                        if (typeof(target._dDragging) == "function") {
                            target._dDragging();
                        }
                        checkDroppables(target);
                    }

                    function checkDroppables(draggable) {
                        if (typeof(draggable._dType) != "function") {
                            if (draggable._dDroppableOn in DnD_Registry) {
                                for (k in DnD_Registry[draggable._dDroppableOn][1]) {
                                    droppable = DnD_Registry[draggable._dDroppableOn][1][k];
                                    hitTestPosition = droppable.globalToLocal(stage.mouseX, stage.mouseY);
                                    if ((droppable.id in draggable._dDroppables) && (droppable.hitTest(hitTestPosition.x, hitTestPosition.y))) {
                                        // draggable is still moving on top of droppable
                                        if (typeof(droppable._dDraggableMove) == "function") {
                                            droppable._dDraggableMove(draggable);
                                        }
                                    }
                                    else if ((droppable.id in draggable._dDroppables) && (!droppable.hitTest(hitTestPosition.x, hitTestPosition.y))) {
                                        delete draggable._dDroppables[droppable.id];
                                        if (typeof(droppable._dDraggableExit) == "function") {
                                            droppable._dDraggableExit(draggable);
                                        }
                                    }
                                    else if (!(droppable.id in draggable._dDroppables) && (droppable.hitTest(hitTestPosition.x, hitTestPosition.y))) {
                                        draggable._dDroppables[droppable.id] = droppable;
                                        if (typeof(droppable._dDraggableEnter) == "function") {
                                            droppable._dDraggableEnter(draggable);
                                        }
                                    }
                                }
                            }
                        }
                        else {
                            if ("__func__" in DnD_Registry)
                                for (k in DnD_Registry["__func__"][1]) {
                                    droppable = DnD_Registry["__func__"][1][k];
                                    if ((typeof(droppable._dType) == "function") && (draggable._dDroppableOn(draggable, droppable))) {
                                        hitTestPosition = droppable.globalToLocal(stage.mouseX, stage.mouseY);
                                        if ((droppable.id in draggable._dDroppables) && (droppable.hitTest(hitTestPosition.x, hitTestPosition.y))) {
                                            // draggable is still moving on top of droppable
                                            if (typeof(droppable._dDraggableMove) == "function") {
                                                droppable._dDraggableMove(draggable);
                                            }
                                        }
                                        else if ((droppable.id in draggable._dDroppables) && (!droppable.hitTest(hitTestPosition.x, hitTestPosition.y))) {
                                            delete draggable._dDroppables[droppable.id];
                                            if (typeof(droppable._dDraggableExit) == "function") {
                                                droppable._dDraggableExit(draggable);
                                            }
                                        }
                                        else if (!(droppable.id in draggable._dDroppables) && (droppable.hitTest(hitTestPosition.x, hitTestPosition.y))) {
                                            draggable._dDroppables[droppable.id] = droppable;
                                            if (typeof(droppable._dDraggableEnter) == "function") {
                                                droppable._dDraggableEnter(draggable);
                                            }
                                        }
                                    }
                                }

                        }
                        if ("__unTyped__" in DnD_Registry) {
                            for (k in DnD_Registry["__unTyped__"][1]) {
                                droppable = DnD_Registry["__unTyped__"][1][k];
                                hitTestPosition = droppable.globalToLocal(stage.mouseX, stage.mouseY);
                                if ((droppable.id in draggable._dDroppables) && (droppable.hitTest(hitTestPosition.x, hitTestPosition.y))) {
                                    // draggable is still moving on top of droppable
                                    if (typeof(droppable._dDraggableMove) == "function") {
                                        droppable._dDraggableMove(draggable);
                                    }
                                }
                                else if ((droppable.id in draggable._dDroppables) && (!droppable.hitTest(hitTestPosition.x, hitTestPosition.y))) {
                                    delete draggable._dDroppables[droppable.id];
                                    if (typeof(droppable._dDraggableExit) == "function") {
                                        droppable._dDraggableExit(draggable);
                                    }
                                }
                                else if (!(droppable.id in draggable._dDroppables) && (droppable.hitTest(hitTestPosition.x, hitTestPosition.y))) {
                                    draggable._dDroppables[droppable.id] = droppable;
                                    if (typeof(droppable._dDraggableEnter) == "function") {
                                        droppable._dDraggableEnter(draggable);
                                    }
                                }
                            }
                        }
                        if ("__func__" in DnD_Registry) {
                            for (k in DnD_Registry["__func__"][1]) {
                                droppable = DnD_Registry["__func__"][1][k];
                                hitTestPosition = droppable.globalToLocal(stage.mouseX, stage.mouseY);
                                if ((droppable.id in draggable._dDroppables) && (droppable.hitTest(hitTestPosition.x, hitTestPosition.y))) {
                                    // draggable is still moving on top of droppable
                                    if (typeof(droppable._dDraggableMove) == "function") {
                                        droppable._dDraggableMove(draggable);
                                    }
                                }
                                else if ((droppable.id in draggable._dDroppables) && (!droppable.hitTest(hitTestPosition.x, hitTestPosition.y))) {
                                    delete draggable._dDroppables[droppable.id];
                                    if (typeof(droppable._dDraggableExit) == "function") {
                                        droppable._dDraggableExit(draggable);
                                    }
                                }
                                else if (!(droppable.id in draggable._dDroppables) && (droppable.hitTest(hitTestPosition.x, hitTestPosition.y))) {
                                    draggable._dDroppables[droppable.id] = droppable;
                                    if (typeof(droppable._dDraggableEnter) == "function") {
                                        droppable._dDraggableEnter(draggable);
                                    }
                                }
                            }
                        }
                    }
                    
                    function backup(evt) {
                        
                        if(!target._dUnderPress){
                            return;
                        }
                        
                        target._dUnderPress = false;
                        
                        cmtx = target.parent.getConcatenatedMatrix();
                        transformedMouse = transformOriginalPoint(cmtx, stage.mouseX, stage.mouseY);
                        var objectsUnderMouse = stage.getObjectsUnderPoint(transformedMouse.x, transformedMouse.y);
                        captured = false;
                        // array of droppables under mouse if target in not captured 
                        droppablesUnderMouse = [];
                        for (var i = 0; i < objectsUnderMouse.length; i++) {
                            if ((objectsUnderMouse[i].isDroppable) && (canBeDropped(target, objectsUnderMouse[i]))) {
                                objectsUnderMouse[i]._dCaptureDraggable(target);
                                captured = true;
                                if (objectsUnderMouse[i]._dGreedy) {
                                    break;
                                }
                            }
                            else if (objectsUnderMouse[i].isDroppable) {
                                droppablesUnderMouse.push(objectsUnderMouse[i]);
                            }
                        }
                        if ((!captured) && (typeof(target._dRevert) == "function")) {
                            target._dRevert(droppablesUnderMouse);
                        }
                        if (typeof(target._dDragEnded) == "function") {
                            target._dDragEnded();
                        }
                    }
                    
                    evt.onMouseUp = backup;
                }

                function canBeDropped(draggable, droppable) {

                    if (typeof(draggable._dDroppableOn) == "function") {
                        return (draggable._dDroppableOn(draggable, droppable));
                    }
                    else if (typeof(draggable._dDroppableOn) == "object") {
                        canBe = false;
                        if (Array.isArray(draggable._dDroppableOn)) {
                            for (var i = 0; i < draggable._dDroppableOn.length; i++) {
                                if (draggable._dDroppableOn[i] == droppable._dType) {
                                    canBe = true;
                                    break;
                                }
                            }
                            return canBe;
                        }
                        else {
                            if (draggable._dDroppableOn == droppable._dType) {
                                return true;
                            }
                            else {
                                return false;
                            }
                        }
                    }
                    else if (typeof(draggable._dDroppableOn) == "string") {
                        if (draggable._dDroppableOn == droppable._dType) {
                            return true;
                        }
                        else {
                            return false;
                        }
                    }
                }

            })(this);

        };

createjs.DisplayObject.prototype.disableDragging =
        function() {
            this.isDraggable = false;
            delete this._dDragEnded;
            delete this._dDragStarted;
            delete this._dDragging;
            delete this.onPress;
            if (this._dDroppableOn in DnD_Registry) {
                delete DnD_Registry[this._dDroppableOn][0][this.id];
            }
            if (typeof(this._dDroppableOn) != "function") {
                if (this._dDroppableOn in DnD_Registry) {
                    delete DnD_Registry[this._dDroppableOn][0][this.id];
                }
            }
            else {
                if (!("__func__" in DnD_Registry)) {
                    delete   DnD_Registry[__func__][0][target.id];
                }
            }
            delete this._dDroppableOn;
            delete this._dDroppables;
            this.cursor = "default";
        };

createjs.DisplayObject.prototype.enableDropping =
        function(type, containedDraggable, greedy, captureDraggable, releaseDraggable, draggableEnter, draggableMove, draggableExit, unTypedCheck) {
            (function(target) {
                target.isDroppable = true;
                target._dType = type;
                target._dContainedDraggable = containedDraggable;
                target._dGreedy = greedy;
                target._dCaptureDraggable = captureDraggable;
                target._dReleaseDraggable = releaseDraggable;
                target._dDraggableEnter = draggableEnter;
                target._dDraggableMove = draggableMove;
                target._dDraggableExit = draggableExit;
                target._dUnTypedCheck = unTypedCheck;

                if (typeof(unTypedCheck) == "boolean" && unTypedCheck) {
                    if (!("__unTyped__" in DnD_Registry)) {
                        DnD_Registry["__unTyped__"] = [{}, {}];
                    }
                    DnD_Registry["__unTyped__"][1][target.id] = target;
                } else {
                    if (typeof(target._dType) != "function") {
                        if (!(target._dType in DnD_Registry)) {
                            DnD_Registry[target._dType] = [{}, {}];
                        }
                        DnD_Registry[target._dType][1][target.id] = target;
                    }
                    else {
                        if (!("__func__" in DnD_Registry)) {
                            DnD_Registry["__func__"] = [{}, {}];
                        }
                        DnD_Registry["__func__"][1][target.id] = target;
                    }
                }
            })(this);
        };

createjs.DisplayObject.prototype.disableDropping =
        function() {
            if (typeof(this._dUnTypedCheck) == "boolean" && this._dUnTypedCheck) {
                if ("__unTyped__" in DnD_Registry) {
                    delete   DnD_Registry["__unTyped__"][1][this.id];
                }
            }
            else {
                if (typeof(this._dType) != "function") {
                    if (this._dType in DnD_Registry) {
                        delete DnD_Registry[this._dType][1][this.id];
                    }
                }
                else {
                    if ("__func__" in DnD_Registry) {
                        delete   DnD_Registry["__func__"][1][this.id];
                    }
                }
            }
            this.isDroppable = false;
            this._dType = null;
            this._dContainedDraggable = null;
            this._dCaptureDraggable = null;
            this._dReleaseDraggable = null;
        };

// transformOriginalPoint

function transformOriginalPoint(cmtx, mx, my) {
                        _y = (cmtx.a * my + cmtx.b * (cmtx.tx - mx) - cmtx.a * cmtx.ty)
                                / (cmtx.a * cmtx.d - cmtx.b * cmtx.c);

                        _x = (mx - _y * cmtx.c - cmtx.tx)
                                / cmtx.a;
                                
                        return {x : _x, y : _y};
                    }
     
