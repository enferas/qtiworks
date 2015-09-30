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
