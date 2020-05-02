import {StallionPageUtils} from "../utils/page_utils.js"
import { StallionMemory } from "../config/utils.js";
import { stallionUserComment } from "../utils/annotation_utils.js";

var stallionMemory = new StallionMemory()

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
            new stallionUserComment({contents: "", pageIdx: this.pageIdx,
                                    rect: {x:x - 40,y:this.startY-10,w:200,h:100}})
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
            window.getSelection().removeAllRanges();
            this.range = document.createRange()


        });

        StallionPageUtils.getPageDiv(this.pageIdx).querySelector(".textLayer")
        .addEventListener("mousemove", 
        e=>{
            // var x = e.clientX;
            // var y = e.clientY;
            // console.log(e.srcElement)
            // if(e.srcElement.nodeName != "SPAN" && e.srcElement.nodeName != "#text")
            // {
                    // e.preventDefault()
            // }
            if(!this.range)
                return;

            e.preventDefault()
            this.range.selectNodeContents(e.srcElement);
            window.getSelection().addRange(this.range)
        });


        StallionPageUtils.getPageDiv(this.pageIdx).querySelector(".textLayer")
        .addEventListener("mouseup", 
        e=>{
            window.getSelection().removeAllRanges();
            this.range = null;
        });

    }
}


export {StallionSnippingSelection, StallionSmoothSelection};