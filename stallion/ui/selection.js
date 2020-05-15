import {StallionPageUtils} from "../utils/page_utils.js"
import { StallionMemory } from "../config/utils.js";
import { StallionUserComment } from "./user_annotation.js";
import {StallionUIStateManager} from "./ui_state_manager.js";
var stallionMemory = new StallionMemory()


class StallionSelectionUtils{
        // experimental    
        static _isTextElement(srcElement){
            return srcElement.nodeName != "DIV"   // GUY TODO: Not perfect 
        }
    
        // experimental    
        static _getTextOffsetByPosition(evt, srcElement){
            var {x} = StallionPageUtils.evtMouse(evt, srcElement); 
            var fontSize = StallionPageUtils.getTextWidth(srcElement)
            var textOffset = Math.round(x/fontSize);
            return textOffset > 0 ? textOffset : 0;
        }
    

        static selectNode(node){
            var range = document.createRange();
            range.selectNode(node)
            var selection = window.getSelection();
            selection.removeAllRanges()
            selection.addRange(range)         
        }

}



class StallionSnippingSelection{
    start(pageIdx){
        var curDiv = StallionPageUtils.getPageDiv(pageIdx);
        this.curDiv = curDiv;
        var curCanvas = curDiv.querySelector(".textLayer")

        this.pageIdx = pageIdx;
        curCanvas.addEventListener("mousedown", e => {
        e.preventDefault();
        var {x,y} = StallionPageUtils.evtMouse(e, curCanvas);
        this.setRangeStart(curCanvas, x, y);
        });

        curCanvas.addEventListener("mouseup", e => {
            e.preventDefault();
            var {x,y} = StallionPageUtils.evtMouse(e, curCanvas);
            this.setRangeEnd(curCanvas, x, y);
        });

        curCanvas.addEventListener("mousemove", e => {
            if(!this.selectionDiv)
                return;

            e.preventDefault();
            var {x,y} = StallionPageUtils.evtMouse(e, curCanvas);
            this.moveRange(curCanvas, x, y);
        });

    }

    moveRange(src, x, y){
        var width = Math.abs(x-this.startX)
        var height = Math.abs(y-this.startY);
        var left = Math.min(x, this.startX);
        var top = Math.min(y, this.startY);
        this.selectionDiv.style.top = `${top}px`
        this.selectionDiv.style.left = `${left}px`
        this.selectionDiv.style.width = `${width}px`
        this.selectionDiv.style.height = `${height}px`

    }


    setRangeEnd(src, x,y){
        var selectionDiv = this.selectionDiv;
        if(!(selectionDiv.offsetWidth < 10 && selectionDiv.offsetWidth < 10))
        {
            var spans = src.querySelectorAll(".textLayer span");
            for(var sp of spans){
                if(StallionPageUtils.checkIntersection(selectionDiv, sp)){
                    sp.classList.add("highlight");
                }
            }

            stallionMemory.addPageDataEntry(this.pageIdx, "userAnnotations",
            new StallionUserComment({contents: "", pageIdx: this.pageIdx,
                                    rect: {x:x - 40,y:this.startY-10,w:200,h:100},
                                    pdfDocument: this.pdfDocument})
            )
    }
    this.selectionDiv.remove();
    this.selectionDiv = null;

    }

    setRangeStart(src, x, y){
        this.startX = x;
        this.startY = y;
        var selectionDiv = document.createElement("div");
        selectionDiv.style.border = '3px solid #0000ff'
        selectionDiv.style.backgroundColor = 'rgb(0,0,180,0.4)'
        selectionDiv.style.top = `${y}px`;
        selectionDiv.style.left = `${x}px`;
        selectionDiv.style.width = '3px'
        selectionDiv.style.height = '3px'
        selectionDiv.style.position = 'absolute';
        src.appendChild(selectionDiv);
        console.log(selectionDiv)
        this.selectionDiv = selectionDiv;

    }


}

class StallionSmoothSelection{

    start(pageIdx){
        this.pageIdx = pageIdx;

        StallionPageUtils.getPageDiv(this.pageIdx).querySelector(".textLayer")
        .addEventListener("mousedown", 
        e=>{
            if(e.button != 0 || StallionUIStateManager.getFocusState() == "contextmenu")
                return;
            var x = e.clientX;
            var y = e.clientY;
            console.log(StallionUIStateManager.getFocusState())
            // e.preventDefault()
            window.getSelection().removeAllRanges();
            this.range = document.createRange()
            var offset = StallionSelectionUtils._getTextOffsetByPosition(e, e.srcElement);
            console.log(offset)
            
            this.range.setStart(e.srcElement.firstChild, offset)

        });

        StallionPageUtils.getPageDiv(this.pageIdx).querySelector(".textLayer")
        .addEventListener("mousemove", 
        e=>{
            if(!this.range)
            return;

            var x = e.clientX;
            var y = e.clientY;
            e.preventDefault()
            if(StallionSelectionUtils._isTextElement(e.srcElement))
            {
                var offset = StallionSelectionUtils._getTextOffsetByPosition(e, e.srcElement);
                this.range.setEnd(e.srcElement.firstChild, offset);
                window.getSelection().removeAllRanges()
                window.getSelection().addRange(this.range)

            }

        });


        StallionPageUtils.getPageDiv(this.pageIdx).querySelector(".textLayer")
        .addEventListener("mouseup", 
        e=>{
            this.range = null;
        });

    }
}


export {StallionSnippingSelection, StallionSmoothSelection};