
class StallionPageUtils{

    static evtMouse(evt, source = null){
        // if(!source)
        //     source = evt.target || evt.srcElement;
            
        var top = window.scrollY + source.getBoundingClientRect().top;
        var left = window.scrollX + source.getBoundingClientRect().left;
        return {x: evt.pageX-left,
            y: evt.pageY-top}

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



}

export {StallionPageUtils}