
class HeuristicsHelper{
    constructor(){

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




class PageHeuristics{
    constructor(){
        this.debugMode = false;
        this.helper = new HeuristicsHelper()
        this._fonts = {};
        this._images = [];
        this.idx = 0;

        // Set primary estimates
        this._maxImgDim = 1000;
        this._blockJumpPctTol = 1.4;
    }
    setMainCtx(mainCtx){
        this.mainCtx = mainCtx;
    }

    analyzeTextLayer(textLayer){
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

    reportTextAction(ctx, font, x, y){
        var fillStyle = ctx.fillStyle;
        this.helper.incrementDict(this._fonts, font.name);
        if((font.name.indexOf('+CM') != -1)){    // GUY TODO: Fix to regexp
            if(this.debugMode){
                ctx.fillStyle = 'rgba(0,0,225,0.2)';
                ctx.fillRect(x,y, 10,-10)       //Guy TODO: though works marvelously, 10 is just a heuristic. FIX  
                ctx.fillStyle = fillStyle;
            }
        }

        this.idx++;
    }

    reportImageAction(ctx,x, y, w, h, type){
        if(w >= this._maxImgDim || w>= this._maxImgDim){
            return;
        }
        var rect = [x,y,w,h];
        this._images.push({'ctx':ctx, 'rect': rect, 'type': type})
    }

    finishedRenderingContext(curCtx){
        if(!this.debugMode)
            return;
        var ctx = curCtx.getContext('2d')
        this._images.forEach((img) =>{
            var rect = img['rect'];
            // if(ctx != curCtx)   
            //     return;
            var fillStyle = ctx.fillStyle;
            ctx.fillStyle = "rgba(225, 0, 0, 0.2)";
            ctx.fillRect(rect[0], rect[1], rect[2], rect[3]);
            console.log(rect);
            ctx.fillStyle = fillStyle;
        });

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
