//import { PDFFindController } from "./pdf_find_controller.js";

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
}
class FinderHeuristics{
    constructor(){
        this.helper = new HeuristicsHelper()
        this._fonts = {};
        this.idx = 0;
    }

    reportTextAction(ctx, font, x, y){
        var fillStyle = ctx.fillStyle;
        this.helper.incrementDict(this._fonts, font.name);
        if((font.name.indexOf('+CM') != -1)){    // GUY TODO: Fix to regexp
            ctx.fillStyle = 'rgba(0,0,225,0.2)';
            ctx.fillRect(x,y, 10,-10)       //Guy TODO: though works marvelously, 10 is just a heuristic. FIX  
            ctx.fillStyle = fillStyle;
        }

        this.idx++;
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
