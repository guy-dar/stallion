import {StallionWindowWidget} from "./widgets.js"
import {StallionPageCoordinateTranslation} from "../utils/text.js"
import {StallionPageUtils} from "../utils/page_utils.js"

function getStallionCommentWindow({x, y, pageIdx}){
    var win = new StallionWindowWidget();
    win.setDimensions(500, 160);

    win.iframeBody.innerHTML = "<br/><textarea style = 'width:100%; height: 85px;\
                            border-radius:5px;' id = 'commentText'></textarea>\
                            <br/>\
                            <button id = 'commentBtn' \
                    style = 'margin-top:7px; background-color:red; color:white; border-radius:10px;\
                    box-shadow: none; outline: none; height:32px; right:10px; position: fixed; \
                    width:85px;'>\
                    Comment</button>";
    
    win.iframeBody.querySelector("#commentText").onkeydown = function(evt){
        
        if(evt.ctrlKey && evt.keyCode == 13){
            win.iframeBody.querySelector('#commentBtn').click();
        }

    }


    win.iframeBody.querySelector('#commentBtn').onclick = () =>{
        var commentText = win.iframeBody.querySelector('#commentText').value;
        win.hide()
        // GUY TODO: FIX Get original page from context menu
        var canvas = StallionPageUtils.getPageCanvas(PDFViewerApplication.page - 1);
        var {x:x_, y:y_} = StallionPageCoordinateTranslation.divToPdf(PDFViewerApplication.pdfViewer,
                                                                             x, y, 0, 0, pageIdx)
        // console.log({x_, y_})
        // StallionPageUtils.drawRect(x, y, 100, 100)
        PDFViewerApplication.pdfDocument
                            .stallionCreateComment(pageIdx, 
                                [x_, y_, 100, 100], commentText).then(p =>{
                                    console.log(p);
                                });
    }


}


export {getStallionCommentWindow}