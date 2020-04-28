
class HeuristicsHelper{

    fontNormalizer(fontData){
        return {'name': fontData.font.name,
                'fontSize': fontData.fontSize * fontData.textMatrixScale,       // GUY TODO: change this to scaled font size if necessary! probably is!
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
    descendants (element) {
        return Array.from(element.querySelectorAll("*"));
    }
    leafNodes(element){
        return this.descendants(element).filter(n=>{
            return !n.hasChildNodes();
        })
    }
    isDictInArray(dict, arr){
        for (let i = 0; i < arr.length; i++) {
            const element = arr[i];
            if(JSON.stringify(element) == JSON.stringify(dict)){
                return true;
            }
        }
        return false;
    }
    
    _last(arr){
        return arr.slice(-1)[0];
    }
        
    addToRangeTracker(range, familyArr, value){
        if(!range[familyArr])
            range[familyArr] = [];
        for (let i = 0; i < familyArr.length; i++) {
            const element = familyArr[i];
            range[element].push(value);           
        }
    }

}


export {HeuristicsHelper}
