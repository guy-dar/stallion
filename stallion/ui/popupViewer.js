import {DivMaker, renderStallionWidget, makeEscapable} from "./common.js";
import {StallionPageUtils} from "../utils/page_utils.js"
import { PDFViewerApplication } from "../../web/app.js";

function getPopupViewer(pdfDocument, pageIdx, explicitDest, {mouseX,mouseY}){
        var popupContainer = DivMaker.create(".stallionPopupContainer", 
        document.getElementById("outerContainer"));
        var popupMain = DivMaker.create(".stallionPopupMain", popupContainer);
        var iframeHtml = document.createElement('iframe');
        iframeHtml.style.width = "100%"
        popupMain.appendChild(iframeHtml);
        popupContainer.style.position = 'absolute';
        popupContainer.style.left = `${mouseX-100}px`;
        popupContainer.style.width = '700px';
        popupContainer.style.height = `200px`;
        popupContainer.style.bottom = `${mouseY}px`;


        var frame = iframeHtml.contentDocument.documentElement;
        frame.style.overflow = 'hidden'
        var explicitDest_ = JSON.parse(JSON.stringify(explicitDest));
        // explicitDest_[1].name = "Fit";

        var fixedDest = StallionPageUtils.translateDestArray({
          pageNumber: pageIdx + 1,
          destArray: explicitDest_,
          ignoreDestinationZoom: false,
          viewer: PDFViewerApplication.pdfViewer,
          frame,
          frameScale: 2
        });
        
        
        renderStallionWidget(frame, {
          frameScale: 2,
          widgetHider: ()=>{popupContainer.remove();},
          container: popupContainer,
          pdfDocument: pdfDocument,
          pageIdx: pageIdx,
          dest:  fixedDest// GUY TODO: Improve
        });

        return popupContainer;
    }


  function getLinkPopupViewer(link){
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
    iframeHtml.src = link;
    makeEscapable(popupContainer, ()=>{popupContainer.remove()});
  }

export {getPopupViewer, getLinkPopupViewer};