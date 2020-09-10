import {StallionWindowWidget} from "./widgets.js"
import {StallionPDFEditor} from "../writer/editor.js"


function getStallionCommentWindow({x, y, pageIdx}){
    var win = new StallionWindowWidget();
    win.setDimensions(500, 165);

    win.iframeBody.innerHTML = "<br/><br/><textarea style = 'width:100%; height: 75px;\
                            border-radius:5px;' id = 'commentText'></textarea>\
                            <br/>\
                            <button id = 'commentBtn' \
                    style = 'margin-top:7px; background-color:red; color:white; border-radius:10px;\
                    box-shadow: none; outline: none; height:32px; right:10px; position: fixed; \
                    width:85px;'>\
                    Comment</button>";
    



    win.iframeBody.querySelector('#commentBtn').onclick = () =>{
        var commentText = win.iframeBody.querySelector('#commentText').value;
        win.hide()
        PDFViewerApplication.pdfDocument
                            .stallionCreateComment(pageIdx, 
                                [x, y, 100, 100], commentText);
    }
}


export {getStallionCommentWindow}