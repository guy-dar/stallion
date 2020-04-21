const CSS_UNITS = 96.0 / 72.0;


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
  elmnt.onmouseout = closeDragElement;
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
  


export {makeDraggable, htmlClone, moveElement,  CSS_UNITS, popupOneTimeBackButton}