import {makeEscapable, makeDraggable} from "./common.js"
  

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
  


class StallionToastWidget{

  static log(msg){
    console.log(msg)
    var toast = document.createElement("div");
    toast.id ="stallionToast";
    toast.innerText = msg;
    document.querySelector("body").appendChild(toast);
    setTimeout(function(){
      StallionToastWidget._fadeOutAndRemove(toast);
    }, 50 * msg.length);
  }

  static _fadeOutAndRemove(toast, intervalTime = 20, opacityDrop = 0.05){
    var opacity = 1;
    var _internalOpacityFader = setInterval(function(){
      opacity -= opacityDrop;
      if(opacity <= 0){
        toast.remove();
        clearInterval(_internalOpacityFader)
        return;
      }
      toast.style.opacity = opacity;
    }, intervalTime);

  }

}  



class StallionWindowWidget {

  static openWindows = new Set();
  constructor(dynamicResize = false){
    // Container
    this.container = this._createContainer();
    // Header
    this._createHeader()

    // Iframe
    this.iframe = document.createElement("iframe");
    this.iframe.classList.add("peekBox")
    this.container.appendChild(this.iframe)
    
    // Footer
    this.footer = document.createElement("div");
    this.footer.classList.add("peekBoxFooter")
//    this.container.appendChild(this.footer)

    this._containerParent().appendChild(this.container)
    this.iframeBody = this.iframe.contentDocument.documentElement.querySelector("body");
    StallionWindowWidget.openWindows.add(this);

    // Add features to window
    if(dynamicResize)
      this._dynamicResize()

    makeEscapable(this.container, ()=>{this.hide()}, [document, this.iframeBody]); 
    makeDraggable(this.container, [this.header, this.footer]); 
  
  }

  _containerParent(){
    return document.getElementById("outerContainer")
  }

  _createContainer(){
    var container = document.createElement("div");
    container.classList.add("stallionWindow")
    return container 
  }


  _createHeader(){
    this.header = document.createElement("div");
    this.header.classList.add("peekBoxHeader")
    this.container.appendChild(this.header)

    // GUY TODO: this is shitty
    var html = '<div style = "zoom:0.9; display:table; z-index: 4; background-color:#aaaaaa;" class="splitToolbarButton"><button class = "closeStallionWindow" style="font-weight:bold;align-items: center;text-shadow: 0px -1px 0px rgba(200,200,200,.9);box-shadow: 0px -1px 0px rgba(80,80,80,.9);padding: 3px;font-family: Helvetica;border:0px solid black;text-align: center;position: absolute;background-color:#777777;height: 70%;width: 19px;top: 15%;border-radius: 5px;vertical-align:middle;color:#aaaaaa;padding: 2px;"><span>&times</span></button>'
    this.header.innerHTML = html;
    this.header.querySelector(".closeStallionWindow").onclick = () => {this.hide();}

  }

  _dynamicResize(){
    (new ResizeObserver(entries => {
      for(const entry of entries){
        this.container.style.height = `${entry.contentRect.height}px` // GUY TODO: magic number
      }
    })).observe(this.iframeBody);
  }



  params(){
        return {container: this.container, widgetHider: ()=>{},
        fitCanvasToFrame: false};
  } 

  hide(){
    StallionWindowWidget.openWindows.delete(this);
    this.container.remove();
  }

}


export { SplitViewerWidget, StallionToastWidget, StallionWindowWidget}  