import {HeuristicsHelper} from "./helper.js"
import {StallionConfig} from "../config/utils.js"
var stallionConfig = new StallionConfig();

class PageHeuristics{
    constructor(){
        this.startRendering();
    }

    startRendering(){
        this.debugMode = stallionConfig.getValue("debugMode");
        this.helper = new HeuristicsHelper();
        this._prevLineFonts = null;
        this._curLineFonts = [];
        this._textBlocks = [];
        this._fonts = [];
        this._lineBeginning = [];
        this._curFontCtx = null;
        this._images = [];
        this.idx = 0;

        // Set primary estimates
        this._maxImgDim = 1000;
    }


    isTextBlockShared(newFontCtx, curTextBlock, prevFontCtx){
        if(!curTextBlock)
            return false;

        // Column jump
        if(this.helper._isColumnJump(newFontCtx, prevFontCtx)){
            return false
        }

        // Too distant lines
        if(newFontCtx.y - prevFontCtx.y > 2 * Math.max(prevFontCtx.h, newFontCtx.h) ){
            return false;
        }
        

        return this.helper.isDictInArray(newFontCtx.font, curTextBlock.fonts);  // GUY TODO: Fix. should be after the line is processed. Before is just approximation
    }


    handleTextAction(ctx, fontData, scaledX, scaledY){
        this.reportTextAction(ctx, fontData, scaledX, scaledY);
        if(stallionConfig.getValue("darkMode"))
            ctx.fillStyle = "#ffffff"
        return ctx;

    }
    reportTextAction(ctx, fontData, scaledX, scaledY){
        if(!this.debugMode)
            return;
        var font = this.helper.fontNormalizer(fontData);
        var {e: x, f: y, a: scaleA, d: scaleB} = ctx.getTransform(); //GUY TODO: As a matter of fact, a is only x's scale.
        var h = font.fontSize * scaleB;   // GUY TODO: Should it be scaled?
        var w = h;                       // GUY TODO: that's dumb. But cannot get char width. is it because the char is square?
        y -= h;
        x += scaledX*scaleA;
        y += scaledY*scaleB;
        // GUY TODO: !!!!!!!!!!!!!!!!! FIX ONCE YOU UNDERSTAND WHAT'S GOING ON!!!!!!!!!
        var newFontCtx = this.helper._generateFontContext(x, y, w, h, font);
        var curTextBlock = this.helper._last(this._textBlocks);
        

        /**** Identify text blocks ****/ 

        if(this.helper.isLineBreak(newFontCtx, this._curFontCtx)){
            if(!this.isTextBlockShared(newFontCtx, curTextBlock, this._curFontCtx)){
                
                this._textBlocks.push({ left: x, top: y,
                                         right: x+w,
                                         bottom: y+h,
                                         fonts: []});
                curTextBlock = this.helper._last(this._textBlocks);
            }             
        }

        // Push character's font to block
        if(!this.helper.isDictInArray(newFontCtx.font, curTextBlock.fonts))
            curTextBlock.fonts.push(newFontCtx.font);

        // Update
        var {x: left , y: top, bottom, right} = newFontCtx;
        curTextBlock.right = Math.max(right, curTextBlock.right);
        curTextBlock.bottom = Math.max(bottom, curTextBlock.bottom);
        curTextBlock.left = Math.min(left, curTextBlock.left);
        curTextBlock.top = Math.min(top, curTextBlock.top);

        /**** Handle different fonts ****/

        if((font.name.indexOf('+CM') != -1)){                       // GUY TODO: Fix to regexp
            // Paint equations in debug mode
            if(this.debugMode){
                this.helper.addRect(ctx, 'rgb(0,225,0,0.2)', x, y, w, h)  
                                    //Guy TODO: though works marvelously, 10 is just a heuristic. FIX 
            }
        }

        /**** Update character context ****/
        ctx.fillStyle = "#ffffff"        
        ctx.strokeStyle = "#ffffff"        

        this._curFontCtx = newFontCtx;
        this.idx++;
    }

    reportImageAction(ctx,x, y, w, h, type){
        if(w >= this._maxImgDim || w>= this._maxImgDim){
            return;
        }
        var rect = [x,y,w,h];
        this._images.push({'ctx':ctx, 'rect': rect, 'type': type})
    }


    finishedRenderingContext(curCtx,viewport, transform){
        // curCtx.style.backgroundColor = "#000000"
        if(!this.debugMode)
        return;
        
        var ctx = curCtx.getContext('2d');
        this._textBlocks.forEach(block =>{
            var {left,top, right, bottom} = block;
            this.helper.addRect(ctx, 'rgb(0,0,225,0.2)', left, top, right-left, bottom-top, null);
        });
        
        this._images.forEach((img) =>{
            var rect = img['rect'];
            this.helper.addRect(ctx, 'rgb(225,0,0,0.2)',rect[0], rect[1], rect[2], rect[3]);
            console.log(rect);
        });

    }


/*** Deprecated ***/

    // Probably should be deleted. Or at least distilled
    analyzeTextLayer(textLayer){
        return;
        var textDivs = textLayer.textDivs;
        var blockBreaks = [];
        var lastFeatures = null;
        for (let n = 0; n < textDivs.length; n++) {
            const curFeatures = this.helper.htmlFeatures(textDivs[n]);
            if(lastFeatures){
                var dominantFeatures = ( curFeatures.height >= lastFeatures.height) ? curFeatures : lastFeatures;
                var jump = (Math.abs(curFeatures.top - lastFeatures.bottom));
                if(jump >= dominantFeatures.height * this._blockJumpPctTol){
                    blockBreaks.push(n);
                    if(this.debugMode)
                        console.log(textDivs[n]);
                }
            }

            lastFeatures = curFeatures;
        }
    }



}


export {PageHeuristics}
