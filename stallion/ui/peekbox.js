import {htmlClone, makeDraggable, renderStallionWidget} from "./common.js"
import {makeEscapable} from "../utils/ui_utils.js"

function peekView(element, pageIdx, pdfDocument) {

  var peekBoxContainer = document.getElementById("peekBoxContainer");
  var oldPage = document.querySelector("#viewerContainer .page[data-page-number='"+(pageIdx + 1)+"']");
  var peekBox = document.querySelector("#peekBoxContainer .peekBox").contentDocument.documentElement;
    const spot =  {x: element.offsetLeft - 60, y: element.offsetTop - 100, 
      width: oldPage.offsetWidth, height: 500};
      //this.visual_heuristics.estimateTextBlock(pageIndex, element);  
      var loc = {pdfDocument, pageIdx, container: peekBoxContainer, widgetHider: ()=>{},
                fitCanvasToFrame: false};

      renderStallionWidget(peekBox, loc)
          .then(()=>{
          var {iframeBody, iframeDoc} = getPeekBox(spot.width, spot.height);
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
  

  var _pinnedPeekBoxes = 0;
  function getPeekBox(width = 800, height = 400){
    var peekBoxContainer = document.getElementById("peekBoxContainer");
    
    var peekBox = document.querySelector("#peekBoxContainer .peekBox");
    var iframeBody = peekBox.contentDocument.documentElement.querySelector("body"); 
    
    peekBoxContainer.style.position = "absolute";
    peekBoxContainer.style.width = width + "px";
    peekBoxContainer.style.height = height + "px";
    
        
    var iframeDoc = iframeBody.children[0]; //GUY TODO: Fix  improve to sth standard

    iframeBody.onmousedown =() =>{
      peekBoxContainer.style.backgroundColor = "black"
    };

    iframeBody.onmouseup =() =>{
      peekBoxContainer.style.backgroundColor = "gray"
    };
    iframeBody.onkeydown = (evt)=>{
      if(evt.keyCode == 27)
      {
        peekBoxContainer.classList.add("hidden");
      }
    }
    makeDraggable(peekBoxContainer); 
    
    return {iframeDoc, iframeBody, peekBoxContainer};
  }
  



export {getPeekBox, peekView}