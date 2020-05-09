// import {Annotation} from "../../src/core/annotation.js"
import {StallionPageUtils} from "../utils/page_utils.js"


class StallionUserComment{

    constructor(params){
        var {contents, pageIdx, rect} = params;
        this.rect = rect;
        this.pageIdx = pageIdx;
        var comment_div = document.createElement("textarea");
        // comment_div.contentEditable = true;
        comment_div.addEventListener("input", ()=> {
            // comment_div.style.height = `${comment_div.scrollHeight}px`;
            // comment_div.style.width = `${comment_div.scrollWidth}px`;
        })
        comment_div.style.padding = "8px";
        comment_div.style.top    = `${this.rect.y}px`;
        comment_div.style.left   = `${this.rect.x}px`;
        comment_div.style.width  = `${this.rect.w}px`;
        comment_div.style.height = `${this.rect.h}px`;
        comment_div.style.backgroundColor = "yellow";
        comment_div.style.opacity = "0.8";
        comment_div.style.border = "1px solid black";
        comment_div.style.borderRadius = "7%";
        comment_div.style.fontFamily = "New Times Roman"
        comment_div.style.fontWeight = "bold"
        comment_div.innerText  = contents;
        comment_div.style.position = 'absolute';

        this.comment_div = comment_div;
        this.hide();
        StallionPageUtils.getPageDiv(this.pageIdx)
                    .appendChild(comment_div);
        this.show();
    }

    get contents(){
        return this.comment_div.innerText;
    }


    show(){
        this.comment_div.classList.remove("hidden");
        this.escEvent = StallionPageUtils.addEscEvent(e =>{this.hide()});
    }

    hide(){
        this.comment_div.classList.add("hidden");
        StallionPageUtils.removeEscEvent(this.escEvent);
    }

    
    
}


export {StallionUserComment};