//import { PDFFindController } from "./pdf_find_controller.js";

class HeuristicsHelper{
    constructor(){

    }
    select(elArr){
        elArr.addClass('highlight');    
    }

    arr_counts(arr){
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
        var sorted_items = this.sort_dict(this.arr_counts(arr));
        return sorted_items[0][0];
    }
}
class FinderHeuristics{
    constructor(){
        this._fonts = [];
    }

    reportTextAction(ctx, font, x, y){
        var fillStyle = ctx.fillStyle;
        ctx.fillStyle = 'rgba(225,0,0,0.2)';
        ctx.fillRect(x,y, 20,20)
        ctx.fillStyle = fillStyle;

    }


    // constructor(){
    //     // this.pdfDocument = pdfDocument;
    //     // this.helper = new HeuristicsHelper();
    //     // this.findController = findController;
    //     // this._digestFontBehavior();
    //     // this.findController._extractSpanPromises.then(() =>{
    //     //     this._digestFontBehavior();
    //     //     this._decideStrategy();
    //     // })
    // }
    d(q){   //TODO: fix
        return $(q)//, this.pdfDocument);
    }

    // allSpans(){
    //     return $('#viewer span');
    // }

    _digestFontBehavior(){
      var fontSizes = this.allSpans()
                            .map(function(i){
                            return parseFloat($(this).css('font-size'));
                        }).get();
      this._regularFontSize = this.helper.maj(fontSizes);
     
    }

    _isHeadline(){
        return (i, el)=>(parseInt($(el).css('font-size')) > this._regularFontSize);
    }

    _decideStrategy(){

    }

}


export {FinderHeuristics, HeuristicsHelper}
