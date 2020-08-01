
import { HeuristicsHelper } from "./helper";


class DocumentHeuristics{
    constructor(){
        this._pagesDone = {};
        this._firstAppearance = {};
        this._lastPageRange = -1;
    }

    // GUY TODO: FIX bad heuristics and essentially using single page
    _propagateDocumentStyle(fonts){
        var helper = (new HeuristicsHelper())
        var defaultFont = (helper.sortDict(fonts))[0][0];
        
    }


    findMatchInFontRange(query, qName, qNameValue, rangeTypes, textLayer, findController){
        findController._eventBus.on("pagerendered", e=>{
                    var pdfPage = e.source;
                    console.log(e.source.id)
                    var pageContent = findController._pageContents[e.source.id - 1]
                    var positions = pdfPage.heuristics._getPhrasePositions(pageContent, textLayer, query, qName);
                    for(var jj = 0; jj < positions.length; jj++){
                        console.log([positions[jj][1],  qNameValue])
                        if(positions[jj][1] != qNameValue)
                            return;
                    }

        })
    }

}



class FontHeuristics{
    static _isBold(fontString){
        return fontString.indexOf("Medi") != -1;        
    }    

}




export {DocumentHeuristics}