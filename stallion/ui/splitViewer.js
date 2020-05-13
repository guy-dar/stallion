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
    }

class SplitViewerWidget{
  
  constructor(){
    this.splitPeekerFrame = document.getElementById("splitPeekerFrame");
    this.outerContainer = document.getElementById("outerContainer");
    this.frame = splitPeekerFrame.contentDocument.documentElement;
  }
  

  hide(){
    this.splitPeekerFrame.classList.add("hidden")
    this.outerContainer.classList.remove("splitPeekerOpen");
  }

  reveal(){
    this.splitPeekerFrame.classList.remove("hidden")
    this.outerContainer.classList.add("splitPeekerOpen");
  }


  params(){
    return {
      fitCanvasToFrame: true,
      widgetHider: ()=>{outerContainer.classList.remove("splitPeekerOpen")},
      container: splitPeekerFrame,
     };

  }

}

export {getSplitViewer};