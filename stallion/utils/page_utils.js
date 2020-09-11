import {CSS_UNITS, SCROLLBAR_PADDING, VERTICAL_PADDING} from "../../web/ui_utils.js";

class StallionPageUtils{

    static evtMouse(evt, source = null){
        if(!source)
            source = evt.target || evt.srcElement;
            
        var top = window.scrollY + source.getBoundingClientRect().top;
        var left = window.scrollX + source.getBoundingClientRect().left;
        return {x: evt.pageX-left,
            y: evt.pageY-top}

    }

    static getPageCanvas(pageIndex){
      return StallionPageUtils.getPageDiv(pageIndex).querySelector("canvas");
    }


    static drawRect(x, y, w, h, reuse = true){
        var div = document.createElement("div")
        if(reuse){
            if(StallionPageUtils.div)
                StallionPageUtils.div.remove();
            StallionPageUtils.div = div;
        }
        
        div.style.position = 'absolute'
        div.style.left = `${x}px`
        div.style.top = `${y}px`
        div.style.width = `${w}px`
        div.style.height = `${h}px`
        div.style.backgroundColor = 'gray'
        document.querySelector("body").appendChild(div)
    }


    static checkIntersection(el1, el2){
        var rect1 = el1.getBoundingClientRect()
        var rect2 = el2.getBoundingClientRect()
        return (rect1.left < rect2.right && 
            rect1.right > rect2.left && 
            rect1.top < rect2.bottom && 
            rect1.bottom > rect2.top)
    }


    static getPageDiv(pageIdx){
        return document.querySelector(".page[data-page-number='"+(1+pageIdx)+"']")
    }

    static addEscEvent(func){
        var escEvt = e => {
            if(e.keyCode == 27){
                console.log(e.keyCode)
                func(e);
            }

        };
        document.addEventListener("keydown", escEvt);
        return escEvt;
    }


    static removeEscEvent(escEvt){
        document.removeEventListener("keydown", escEvt);
    }

    // experimental 
    static getTextWidth(span) {
        var spTemp = span.cloneNode()
        spTemp.innerText = 'a'
        spTemp.style.visibility = 'hidden'
        document.querySelector("body").appendChild(spTemp)
        var width = spTemp.offsetWidth;
        spTemp.remove()
        return width;
    }



    static async translateNamedDest(namedDest, viewerApp){
      var pdfDocument = viewerApp.pdfDocument;
      var destArray = (await pdfDocument.getDestination(namedDest));
      var destRef = destArray[0];
      
      var  pageNumber = viewerApp.pdfLinkService._cachedPageNumber(destRef);
      if(pageNumber == null){
        pageNumber = await viewerApp.pdfDocument.getPageIndex(destRef)
        .then(pageIndex => {
          return pageIndex + 1;
        });
      }
      return ({pageNumber, explicitDest: destArray}); //this.translateDestArray
    }


    // GUY TODO: this is should be verified!!! Make sure this does not change state in the original document!
    static translateDestArray({
        destArray = null,
        pageNumber = null,
        allowNegativeOffset = false,
        ignoreDestinationZoom = false,
        viewer = null,
        frame = null,
        frameScale = null
      }) {
        var removePageBorders = true;
        var this_ = viewer;
        const pageView =
          Number.isInteger(pageNumber) && this_._pages[pageNumber - 1];
        if (!pageView) {
          console.error(
              `"${pageNumber}" is not a valid pageNumber parameter.`
          );
          return;
        }
        var pageScale =  pageView.scale;
        var viewport = (frameScale != null) ?  pageView.pdfPage.getViewport({scale: frameScale}) : 
                                            pageView.viewport;
                                            
        let x = 0,
          y = 0;
        let width = 0,
          height = 0,
          widthScale,
          heightScale;
        const changeOrientation = pageView.rotation % 180 !== 0;
        const pageWidth =
          (changeOrientation ? pageView.height : pageView.width) /
          pageScale /
          CSS_UNITS;
        const pageHeight =
          (changeOrientation ? pageView.width : pageView.height) /
          pageScale /
          CSS_UNITS;
        let scale = 0;
        switch (destArray[1].name) {
          case "XYZ":
            x = destArray[2];
            y = destArray[3];
            scale = destArray[4];
            // If x and/or y coordinates are not supplied, default to
            // _top_ left of the page (not the obvious bottom left,
            // since aligning the bottom of the intended page with the
            // top of the window is rarely helpful).
            x = x !== null ? x : 0;
            y = y !== null ? y : pageHeight;
            break;
          case "Fit":
          case "FitB":
            scale = "page-fit";
            break;
          case "FitH":
          case "FitBH":
            y = destArray[2];
            scale = "page-width";
            
            break;
          case "FitV":
          case "FitBV":
            x = destArray[2];
            width = pageWidth;
            height = pageHeight;
            scale = "page-height";
            break;
          case "FitR":
            x = destArray[2];
            y = destArray[3];
            width = destArray[4] - x;
            height = destArray[5] - y;
            const hPadding = removePageBorders ? 0 : SCROLLBAR_PADDING;
            const vPadding = this_.removePageBorders ? 0 : VERTICAL_PADDING;
    
            widthScale =
              (this_.container.clientWidth - hPadding) / width / CSS_UNITS;
            heightScale =
              (this_.container.clientHeight - vPadding) / height / CSS_UNITS;
            scale = Math.min(Math.abs(widthScale), Math.abs(heightScale));
            break;
          default:
            console.error(
                `"${destArray[1].name}" is not a valid destination type.`
            );
            return;
        }
    
    
        if (scale === "page-fit" && !destArray[4]) {
          
          return {x: 0, y: 0};// GUY TODO: What to replace here?
        }
    
        const boundingRect = [
          viewport.convertToViewportPoint(x, y),
          viewport.convertToViewportPoint(x + width, y + height),
        ];
        let left = Math.min(boundingRect[0][0], boundingRect[1][0]);
        let top = Math.min(boundingRect[0][1], boundingRect[1][1]);
    
        if (!allowNegativeOffset) {
          // Some bad PDF generators will create destinations with e.g. top values
          // that exceeds the page height. Ensure that offsets are not negative,
          // to prevent a previous page from becoming visible (fixes bug 874482).
          left = Math.max(left, 0);
          top = Math.max(top, 0);
        }
        return {x: left, y: top};
      }
    


}

export {StallionPageUtils}