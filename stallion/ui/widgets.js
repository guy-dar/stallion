class PeekBoxWidget{

    constructor(){
      this.peekBoxContainer = document.getElementById("peekBoxContainer");
      this.oldPage = document.querySelector("#viewerContainer .page[data-page-number='"+(pageIdx + 1)+"']");
      this.peekBox = document.querySelector("#peekBoxContainer .peekBox").contentDocument.documentElement;
      this.iframeBody = peekBox.contentDocument.documentElement.querySelector("body");
  
      this.iframeBody.onmousedown =() =>{
          peekBoxContainer.style.backgroundColor = "black"
      };
    
      this.iframeBody.onmouseup =() =>{
          peekBoxContainer.style.backgroundColor = "gray"
      };
      makeEscapable(peekBoxContainer); 
      makeDraggable(peekBoxContainer); 
    
    }
        
        params(){
          return {container: peekBoxContainer, widgetHider: ()=>{},
          fitCanvasToFrame: false};
        } 
  
        hide(){
          peekBoxContainer.classList.add("hidden");
        }
  
        reveal(){
          peekBoxContainer.classList.remove("hidden");
        }
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
  
