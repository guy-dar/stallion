import {stallionKeyEvt, StallionUIStateManager} from "../utils/ui_utils.js"

const CSS_UNITS = 96.0 / 72.0;

function makeEscapable(div, hideFunc, elements = null){
  if(!elements)
    elements = [document]
  for(var el of elements){
      el.addEventListener("keydown", stallionKeyEvt("Escape", evt => {
        hideFunc(evt)})
      );
    }
}


function makeDraggable(elmnt, dragElements = null,
    containment = false){

      /////  From W3Schools /////
      
if(!dragElements)
    dragElements = [elmnt];
var {top, left} = fixContainment(elmnt, elmnt.offsetLeft, elmnt.offsetTop);
elmnt.style.left = left + "px";
elmnt.style.top = top + "px";
for(var i=0; i < dragElements.length; i++){
    dragElements[i].onmousedown = dragMouseDown;
}
var pos1 = 0, pos2= 0, pos3 = 0, pos4 = 0;

function dragMouseDown(e) {
  e = e || window.event;
  e.preventDefault();
  // get the mouse cursor position at startup:
  pos3 = e.clientX;
  pos4 = e.clientY;
  elmnt.onmouseup = closeDragElement;
  elmnt.ownerDocument.onmouseenter = closeDragElement;
  // call a function whenever the cursor moves:
  for(var i=0; i < dragElements.length; i++)
      dragElements[i].onmousemove = elementDrag;
  
}

function fixContainment(elmnt, left, top){
  if(containment){
    var upperLeft = elmnt.parentNode.offsetWidth - elmnt.offsetWidth;
    var upperTop = elmnt.parentNode.offsetHeight - elmnt.offsetHeight;
    if(top >=0)
      top = 0;
    if(left >=0)
      left = 0;
      if(left < upperLeft)
        left = upperLeft;
      if(top < upperTop)
        top = upperTop;
  }
  return {top, left};
}

function elementDrag(e) {
  e = e || window.event;
  e.preventDefault();
  // calculate the new cursor position:
  pos1 = pos3 - e.clientX;
  pos2 = pos4 - e.clientY;
  pos3 = e.clientX;
  pos4 = e.clientY;
  // set the element's new position:
  var top = (elmnt.offsetTop - pos2)
  var left = (elmnt.offsetLeft - pos1)
  
  var {left,  top} = fixContainment(elmnt, left, top);
  
  elmnt.style.top = top + "px";
  elmnt.style.left = left + "px";  
  // elmnt.focus();
}

function closeDragElement() {
  // stop moving when mouse button is released:
  for(var i=0; i < dragElements.length; i++)
      dragElements[i].onmousemove = null;
  }

//// From W3Schools   /////



}

function popupOneTimeBackButton(isDown){
    var btn = document.querySelector("#oneTimeBackButton");
    var arrow = btn.querySelector("i");
    arrow.classList.remove("arrowdown");
    arrow.classList.remove("arrowup");
    arrow.classList.add(isDown ? "arrowdown" : "arrowup");
    btn.classList.remove("hidden");
  
  }

function htmlClone(node){
    return node.cloneNode(true);
}

function moveElement(el, x, y){
    el.style.top = (el.offsetTop+y) + "px";
    el.style.left = (el.offsetLeft + x) + "px";
}
  
function renderStallionWidget(iframeBody, loc){
  var fitCanvasToFrame = loc.fitCanvasToFrame;
  var frameScale = loc.frameScale;
  var {pdfDocument, pageIdx, container, widgetHider} = loc;
  var dest = loc.dest || null;
  var newCanvas = document.createElement("canvas")
  var iframeDoc = document.createElement("div")
  var scale = frameScale || PDFViewerApplication.pdfViewer.currentScale * CSS_UNITS;  
    container.classList.remove("hidden");

    return pdfDocument.getPage(pageIdx + 1).then(function(pdfPage) {
    var viewport = pdfPage.getViewport({scale});
    newCanvas.width =  viewport.width;
    newCanvas.height = viewport.height;
    
    var ctx = newCanvas.getContext("2d");
    var renderTask = pdfPage.render({
      canvasContext: ctx,
      viewport: viewport,
    });
    return renderTask.promise;
  }).then(()=>{
    if(!dest){
      iframeDoc.style.top='0px'
      iframeDoc.style.left='0px'
    }else{
      iframeDoc.style.top=`${20 - dest.y}px`
      iframeDoc.style.left=`${-dest.x}px`
    }
    if(fitCanvasToFrame)
        newCanvas.style.width = '100%'
        
    iframeDoc.style.position = "absolute";
    iframeDoc.innerHTML = '<link rel="stylesheet" type="text/css" href="viewer.css">';
    iframeBody.innerHTML = "";
    iframeBody.appendChild(iframeDoc);
    iframeDoc.appendChild(newCanvas);
    window.addEventListener("keydown", (evt)=>{
      if(evt.keyCode == 27)
      {
        container.classList.add("hidden");
        widgetHider()
      }
    });
      
  })



}



class StallionLookAndFeel{

  static hideOnUnfocus(widget){
    var focusStateName = widget.focusStateName;

    StallionUIStateManager.onFocusStateChange((oldState, newState)=>{

      if(newState != focusStateName)
        widget.hide();
    });

  }

}



class DivMaker{
  constructor(divType, myParent, show = false){
    var selector = divType[0];
    var name = divType.substring(1);
    this.htmlElement = document.createElement('div');
      switch(selector){
        case "#":
          this.htmlElement.id = name;
        break;
        case ".":
          this.htmlElement.classList.add(name);
        break;
      }
    this.parent = myParent;
    if(show){
      this.show();
    }
  }

  getHtmlElement(){
    return this.htmlElement;
  }
  
  show(){
    this.parent.appendChild(this.htmlElement);
  }

  static create(...args){
    var div = new DivMaker(...args);
    div.show();
    return div.getHtmlElement();
  }

}

export 
{ 
  StallionLookAndFeel, 
  makeDraggable,
  makeEscapable,
  htmlClone, 
  moveElement,  
  CSS_UNITS, 
  renderStallionWidget,
  popupOneTimeBackButton,
  DivMaker  
};