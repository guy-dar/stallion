//import { SimpleLinkService } from "../../web/pdf_link_service.js";


class DocumentHeuristics{
    constructor(){
        this._pagesDone = {};
        this._firstAppearance = {};
        this._lastPageRange = -1;
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

        // for (let i = 0; i < findController._linkService.pagesCount; i++) {
        //     var tmpCanvas = document.createElement("canvas");

                
        // }
    }


}







export {DocumentHeuristics}