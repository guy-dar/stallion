import {DivMaker, renderStallionWidget} from "./common.js";
import {StallionPageUtils} from "../utils/page_utils.js"
import { PDFViewerApplication } from "../../web/app.js";

function getPopupViewer(pdfDocument, pageIdx, explicitDest){
        var popupContainer = DivMaker.create(".stallionPopupContainer", 
        document.getElementById("outerContainer"));
        var popupMain = DivMaker.create(".stallionPopupMain", popupContainer);
        var iframeHtml = document.createElement('iframe');
        iframeHtml.style.width = "100%"
        popupMain.appendChild(iframeHtml);
        popupContainer.style.position = 'absolute';
        popupContainer.style.top = `400px`;
        popupContainer.style.left = `10px`;
        popupContainer.style.width = `350px`;
        popupContainer.style.height = `100px`;


        var frame = iframeHtml.contentDocument.documentElement;
        var fixedDest = StallionPageUtils.translateDestArray({
          pageNumber: pageIdx + 1,
          destArray: explicitDest,
          ignoreDestinationZoom: false,
          viewer: PDFViewerApplication.pdfViewer
        });
        
        renderStallionWidget(frame, {
          fitCanvasToFrame: false,
          widgetHider: ()=>{popupContainer.remove();},
          container: popupContainer,
          pdfDocument: pdfDocument,
          pageIdx: pageIdx,
          dest:  fixedDest// GUY TODO: Improve
        });
    }


export {getPopupViewer};