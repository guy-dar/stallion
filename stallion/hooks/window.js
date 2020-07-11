
//import {stallionDblKeyEvt} from "../utils/ui_utils.js"
import {openContextMenu} from "../ui/contextmenu.js"
import {StallionConfig} from "../config/utils.js";
import {makeEscapable} from "../ui/common.js";
import { PDFViewerApplication } from "../../web/app.js";
import { StallionUIStateManager } from "../utils/ui_utils.js";
import { StallionActions } from "../ui/actions.js";

function setStallionWindowEvents(){    
    StallionUIStateManager.setViewerApplication(PDFViewerApplication);
    if(StallionConfig.getValue("stallionContextMenu")){
        document.addEventListener("contextmenu", evt =>{
            evt.preventDefault();
            openContextMenu(evt);
            PDFViewerApplication.pdfDocument.getData().then(data =>{
                console.log(data)
            })
        }, 
        false)
    }
    
    makeEscapable(document.querySelector("#sidebarContainer"), ()=>{ 
        PDFViewerApplication.pdfSidebar.close()
        
    })

    document.getElementById("stallionSidebarHandle").addEventListener("click", ()=>
    {
        StallionActions.showOutline()
    });
}


export {setStallionWindowEvents}