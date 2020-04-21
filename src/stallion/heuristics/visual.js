import {HeuristicsHelper} from "./helper.js"


class VisualHeuristics{
    constructor(){

    }

    _getPage(pageIdx){
        return document.querySelector(".page[data-page-number='" + (pageIdx + 1) + "']");
    }

    estimateTextBlock(pageIdx, element){
        var lineHeight = element.offsetHeight;
        var textLayer = this._getPage(pageIdx).querySelector(".textLayer");
        var spans = Array.from(textLayer.querySelectorAll("span"));
            var curTop = null;
            var range = document.createRange();
            for(let sp of spans){

                if (sp.offsetTop < element.offsetTop - lineHeight)               
                        continue;
                if (!curTop)
                    range.setStartBefore(sp);

                if(curTop && sp.offsetTop - curTop > 2 * lineHeight){       
                    range.setEndBefore(sp);    
                    break;
                }
                
                curTop = sp.offsetTop;
            };   
            
        // range.getBoundingClientRect().style.border = '2px solid red'
        return range.getBoundingClientRect();

    }

}


export {VisualHeuristics}