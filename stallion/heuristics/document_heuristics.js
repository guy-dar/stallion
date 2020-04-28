//import { SimpleLinkService } from "../../web/pdf_link_service.js";


class DocumentHeuristics{
    constructor(){
        this._pagesDone = {};
        this._firstAppearance = {};
        this._lastPageRange = -1;
    }

    _resolveInternalLinks(page){
        // page._autoInternalLinks[link_name].link_service = new SimpleLinkService();

        for(var mm = 0; mm < page._autoInternalLinks.length; mm++){
            var link_name = page._autoInternalLinks[mm][1];
            var {top, left, width, height} = page._autoInternalLinks[mm][0][0];
            var link_div = document.createElement("div");

            link_div.classList.add(link_name);
            link_div.style.top = top + "px";
            link_div.style.left = left + "px";
            link_div.style.height = height + "px";
            link_div.style.width = width + "px";
            link_div.style.position = "absolute";
            console.log(link_div)
            var link_id = "stallion_link_" + link_name;
            if( ! (link_name in this._firstAppearance)){
                link_div.id = link_id;
                this._firstAppearance[link_name] = page._autoInternalLinks[link_name];
                link_div.style.backgroundColor = 'rgb(0,255,0,0.5)'

            } 
            else {
                link_div.style.cursor = 'pointer'
                link_div.onclick = () => {
                    document.getElementById(link_id).scrollIntoView();
                }
                link_div.style.backgroundColor = 'rgb(0,0,255,0.5)'
            }
            page.getPageDiv().appendChild(link_div);
        }

    }

    setPageDone(idx, page){
        this._pagesDone[idx] = page;
        if(idx == this._lastPageRange + 1){
            this._lastPageRange = idx;
            for(var ii = idx; ii in this._pagesDone; ii++){
                this._resolveInternalLinks(this._pagesDone[ii]);
            }
        }

    }
}

export {DocumentHeuristics}