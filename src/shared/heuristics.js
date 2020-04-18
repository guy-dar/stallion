//var solver = require("./src/solver");

class HeuristicsHelper{

    fontNormalizer(fontData){
        return {'name': fontData.font.name,
                'fontSize': fontData.fontSize,       // GUY TODO: change this to scaled font size if necessary! probably is!
            };
    }

    select(elArr){
        elArr.addClass('highlight');    
    }

    arrCounts(arr){
        ///
        var counts = {}
        arr.forEach(function(e) {
            if(counts[e] === undefined) {
              counts[e] = 0
            }
            counts[e] += 1
          })
          return counts
        ///
    }

    sort_dict(dict){
        /////
        // Create items array
        var items = Object.keys(dict).map(function(key) {
            return [key, dict[key]];
        });
        
        // Sort the array based on the second element
        items.sort(function(first, second) {
            return second[1] - first[1];
        });
        
        return items;
        ////
    }

    maj(arr){
        var sorted_items = this.sort_dict(this.arrCounts(arr));
        return sorted_items[0][0];
    }

    incrementDict(dict, val){
        if(dict[val]==undefined) 
            dict[val] = 0;

        dict[val]++; 
    }  

    _generateFontContext(x, y,w, h, font){
        return {x,y,w,h, 
                right: x + w, bottom: y + h, font}

    }
    _isColumnJump(newFontCtx, oldFontCtx){
        return (newFontCtx.y + newFontCtx.h < oldFontCtx.y)
    }

    isLineBreak(newFontCtx, oldFontCtx) {
    
        if(oldFontCtx == null)
            return true;

        // Standard line break 
        if(newFontCtx.y > oldFontCtx.h + oldFontCtx.y){
            return true;
        }
        

        // Column jump 
        if(this._isColumnJump(newFontCtx, oldFontCtx))
            return true;

        return false;
    }

    addRect(ctx_, rgb, x, y, w, h,transform = null) {
        var ctx = ctx_;
        ctx.save();
        if(transform){
            // console.log(transform)
            ctx.resetTransform();
            ctx.transform(transform);
        }
        else{
            ctx.resetTransform();
            ctx.translate(0,0);
        }

        var fillStyle = ctx.fillStyle;
        ctx.fillStyle = rgb;
        ctx.fillRect(x, y, w, h)
        ctx.fillStyle = fillStyle;
        ctx.restore();
        // ctx.setTransform(oldTransform);
    }


    htmlFeatures(elem){
        var w = elem.offsetWidth,
            h = elem.offsetHeight,
            top = elem.offsetTop,
            left = elem.offsetLeft;

            return {
                width : w,
                height: h,
                top: top,
                left: left,
                bottom: top + h,
                right: left + w
            }
    }
}


function isDictInArray(dict, arr){
    for (let i = 0; i < arr.length; i++) {
        const element = arr[i];
        if(JSON.stringify(element) == JSON.stringify(dict)){
            return true;
        }
    }
    return false;
}

function _last(arr){
    return arr.slice(-1)[0];
}


class PageHeuristics{
    constructor(){
        this.startRendering();
    }

    startRendering(){
        this.debugMode = false;
        this.helper = new HeuristicsHelper()
        this._prevLineFonts = null;
        this._curLineFonts = [];
        this._textBlocks = [];
        this._lineBeginning = [];
        this._curFontCtx = null;
        this._images = [];
        this.idx = 0;

        // Set primary estimates
        this._maxImgDim = 1000;
        this._blockJumpPctTol = 1.4;
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
        

        return isDictInArray(newFontCtx.font, curTextBlock.fonts);  // GUY TODO: Fix. should be after the line is processed. Before is just approximation
    }


    reportTextAction(ctx, fontData, scaledX, scaledY){
        var font = this.helper.fontNormalizer(fontData);
        var {e: x, f: y, a: scale} = ctx.getTransform(); //GUY TODO: As a matter of fact, a is only x's scale.
        var h = font.fontSize * scale;   // GUY TODO: Should it be scaled?
        var w = h;                       // GUY TODO: that's dumb. But cannot get char width. is it because the char is square?
        y -= h;
        x += scaledX*scale;
        y += scaledY*scale;
        // GUY TODO: !!!!!!!!!!!!!!!!! FIX ONCE YOU UNDERSTAND WHAT'S GOING ON!!!!!!!!!
        var newFontCtx = this.helper._generateFontContext(x, y, w, h, font);
        var curTextBlock = _last(this._textBlocks);
        

        /**** Identify text blocks ****/ 

        if(this.helper.isLineBreak(newFontCtx, this._curFontCtx)){
            if(!this.isTextBlockShared(newFontCtx, curTextBlock, this._curFontCtx)){
                
                this._textBlocks.push({ left: x, top: y,
                                         right: x+w,
                                         bottom: y+h,
                                         fonts: []});
                curTextBlock = _last(this._textBlocks);
            }             
        }

        // Push character's font to block
        if(!isDictInArray(newFontCtx.font, curTextBlock.fonts))
            curTextBlock.fonts.push(newFontCtx.font);

        // Update
        var {left, top, bottom, right} = newFontCtx;
        curTextBlock.right = Math.max(right, curTextBlock.right);
        curTextBlock.bottom = Math.max(bottom, curTextBlock.bottom);
        // curTextBlock.left = Math.min(left, curTextBlock.left);
        // curTextBlock.top = Math.min(top, curTextBlock.top);

        /**** Handle different fonts ****/

        if((font.name.indexOf('+CM') != -1)){                       // GUY TODO: Fix to regexp
            // Paint equations in debug mode
            if(this.debugMode){
                this.helper.addRect(ctx, 'rgb(0,0,225,0.2)', scaledX, scaledY, 10, -10)  
                                    //Guy TODO: though works marvelously, 10 is just a heuristic. FIX 
            }
        }

        /**** Update character context ****/

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

class SelectionHeuristics{
    constructor(){
        this._maxRegularTextLen = 20;
    }
    selectionType(selection){
        if(selection.length > this._maxRegularTextLen){
            return "reference";
        }
        return "text";
    }

}


export {PageHeuristics, SelectionHeuristics, HeuristicsHelper}
