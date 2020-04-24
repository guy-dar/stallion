import {renderStallionWidget} from "./common.js";


function getSplitViewer(pdfDocument, pageIdx){
        var splitPeekerFrame = document.getElementById("splitPeekerFrame");
        var outerContainer = document.getElementById("outerContainer");
        splitPeekerFrame.classList.remove("hidden")
        outerContainer.classList.add("splitPeekerOpen");
        var frame = splitPeekerFrame.contentDocument.documentElement;
        
        renderStallionWidget(frame, {
          fitCanvasToFrame: true,
          widgetHider: ()=>{outerContainer.classList.remove("splitPeekerOpen")},
          container: splitPeekerFrame,
          pdfDocument: pdfDocument,
          pageIdx: pageIdx,
        //   destArray: explicitDest, // GUY TODO: Improve
        });
        frame.style.direction = 'rtl';
    }


export {getSplitViewer};