import {htmlClone, makeDraggable, renderStallionWidget} from "./common.js"
import { StallionWindowWidget } from "./widgets.js";

function peekView(element, pageIdx, pdfDocument) {

  // var peekBoxContainer = document.getElementById("peekBoxContainer");
  // var peekBox = document.querySelector("#peekBoxContainer .peekBox").contentDocument.documentElement;

  
  var oldPage = document.querySelector("#viewerContainer .page[data-page-number='"+(pageIdx + 1)+"']");
    const spot =  {x: element.offsetLeft - 60, y: element.offsetTop - 100, 
      width: oldPage.offsetWidth, height: 500};
      //this.visual_heuristics.estimateTextBlock(pageIndex, element);  

      
      var {peekBox, iframeBody, peekBoxContainer} = getPeekBox(); // spot.width, spot.height
      var widgetProperties = {pdfDocument, pageIdx, container: peekBoxContainer, widgetHider: ()=>{},
                fitCanvasToFrame: false};
      
      renderStallionWidget(iframeBody, widgetProperties)
      .then(()=>{
          var iframeDoc = iframeBody.children[0]; //GUY TODO: Fix  improve to sth standard
          iframeDoc.style.position = "absolute";

          iframeDoc.style.left = (-spot.x) + "px";
          iframeDoc.style.top = (- spot.y) + "px";

          var highlightObject = oldPage.querySelector("span > .highlight");
          var textLayer = htmlClone(highlightObject);
          textLayer.style.left = ( element.offsetLeft) + "px";
          textLayer.style.top = (  element.offsetTop) + "px";
          textLayer.style.width = (  element.offsetWidth) + "px";
          textLayer.style.height = (  element.offsetHeight) + "px";
          textLayer.style.position = "absolute";
          textLayer.style.backgroundColor = 'lightblue'
          textLayer.style.opacity = 0.3
          textLayer.style.color = 'transparent'
                
          iframeDoc.appendChild(textLayer);
  
         makeDraggable(iframeDoc, [iframeDoc.querySelector("canvas"), textLayer], true);
  
      }
      )
    .catch(function(reason) {
      console.error("Error: " + reason);
    });
  }
  

  function getPeekBox(){  //width = 800, height = 100
    var {container: peekBoxContainer, iframeBody, iframe: peekBox} = new StallionWindowWidget();
    
    iframeBody.style.overflow = 'hidden'
    iframeBody.style.zoom = 0.8    
    
    return {iframeBody, peekBoxContainer, peekBox};
  }
  



export {getPeekBox, peekView}