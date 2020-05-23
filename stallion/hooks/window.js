
//import {stallionDblKeyEvt} from "../utils/ui_utils.js"
import {openContextMenu} from "../ui/contextmenu.js"
import {StallionConfig} from "../config/utils.js";
import {makeEscapable} from "../ui/common.js";
import { PDFViewerApplication } from "../../web/app.js";
import { StallionUIStateManager } from "../utils/ui_utils.js";

function setStallionWindowEvents(){    
    StallionUIStateManager.setViewerApplication(PDFViewerApplication);
    if(StallionConfig.getValue("stallionContextMenu")){
        document.addEventListener("contextmenu", evt =>{
            evt.preventDefault();
            openContextMenu(evt);
        }, 
        false)
    }
    
    makeEscapable(document.querySelector("#sidebarContainer"), ()=>{ 
        PDFViewerApplication.pdfSidebar.close()
    })
}


export {setStallionWindowEvents}