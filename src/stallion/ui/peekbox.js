import {htmlClone, moveElement, makeDraggable} from "./common.js"


function peekView(element, pageIdx, pdfDocument) {
    var newCanvas = document.createElement("canvas")
    var oldPage = document.querySelector(
      "#viewerContainer .page[data-page-number='"+(pageIdx + 1)+"']");
  
      var scaleRatio = null;
    // Render the PDF
    pdfDocument.getPage(pageIdx + 1).then(function(pdfPage) {
        var viewport = pdfPage.getViewport({ scale: PDFViewerApplication.pdfViewer.currentScale*CSS_UNITS });   //GUY TODO: Understand what's the right scale
        newCanvas.width = viewport.width;
        newCanvas.height = viewport.height;
        
        // scaleRatio = newCanvas.height/oldPage.querySelector("canvas").height;
        var ctx = newCanvas.getContext("2d");
        var renderTask = pdfPage.render({
          canvasContext: ctx,
          viewport: viewport,
        });
  
        
        return renderTask.promise;
      }).then(()=>{
  
        const spot =  {x: element.offsetLeft - 60, y: element.offsetTop - 100, 
          width: oldPage.offsetWidth, height: 350}; //this.visual_heuristics.estimateTextBlock(pageIndex, element);
          
          
          var {iframeBody, iframeDoc} = getPeekBox(spot.width, spot.height);
          iframeDoc.id = "peekBoxPage"
          iframeDoc.style.left = (-spot.x) + "px";
          iframeDoc.style.top = (- spot.y) + "px";
          iframeDoc.style.position = "absolute";
          iframeDoc.innerHTML = '<link rel="stylesheet" type="text/css" href="viewer.css">';
          iframeDoc.appendChild(newCanvas);
          
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
  
        makeDraggable(iframeDoc, [newCanvas,textLayer], true);
  
      }
      )
    .catch(function(reason) {
      console.error("Error: " + reason);
    });
  }
  






  var _pinnedPeekBoxes = 0;
  function getPeekBox(width = 400, height = 200, reveal = true, clearBefore = true){
    var peekBoxContainer = document.getElementById("peekBoxContainer");
    
    var peekBox = document.querySelector("#peekBoxContainer .peekBox");
    var iframeBody = peekBox.contentDocument.documentElement.getElementsByTagName("body")[0]; 
    var peekBoxPin = document.querySelector("#peekBoxContainer .pinPeekBox");
    
    peekBoxContainer.style.position = "absolute";
    peekBoxContainer.style.width = width + "px";
    peekBoxContainer.style.height = height + "px";
    
    peekBoxPin.onclick = ()=>{
      var newPeekBoxContainer = peekBoxContainer.cloneNode(true);
      peekBoxContainer.parentElement.appendChild(newPeekBoxContainer);
      peekBoxContainer.id = "peekBoxContainer_" + _pinnedPeekBoxes;
      getPeekBox()
      _pinnedPeekBoxes += 1;
    }
    
    if(clearBefore)
    iframeBody.innerHTML = '<div></div>';
    
    var iframeDoc = iframeBody.children[0];
    
    if(reveal)
    peekBoxContainer.classList.remove("hidden");

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