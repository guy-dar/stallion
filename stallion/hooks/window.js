
//import {stallionDblKeyEvt} from "../utils/ui_utils.js"
import {openContextMenu} from "../ui/contextmenu.js"
import {StallionConfig} from "../config/utils.js";
import {makeEscapable} from "../ui/common.js";
import { PDFViewerApplication } from "../../web/app.js";
import { StallionUIStateManager } from "../utils/ui_utils.js";
import { StallionActions } from "../ui/actions.js";
import {getPopupViewer} from "../ui/popupViewer.js"
import {StallionDocumentHandler} from "./proxy.js"
import { StallionPageUtils } from "../utils/page_utils.js";


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


    extraLoadFunctions();
}












function extraLoadFunctions(){

    StallionDocumentHandler.addFeature("features.links.bindlink", l=>{
        l.link.onmouseover = function(e){
            var mouseX =  400// l.link.getBoundingClientRect().left;
            var mouseY =  100 // l.link.getBoundingClientRect().bottom  + 100;
            StallionPageUtils.translateNamedDest(l.destName, PDFViewerApplication)
            .then(x => {

               if(l.timeout){
                   clearTimeout(l.timeout);
               }
                
               l.timeout = setTimeout(()=>{
                   l.popup = getPopupViewer(PDFViewerApplication.pdfDocument, x.pageNumber - 1, x.explicitDest,
                    {mouseX, mouseY})
                }, 1000);
                
                l.link.onmouseleave = function(){
                    if(l.timeout){
                        clearTimeout(l.timeout)
                        l.timeout = null;
                    }
                    if(l.popup){
                        l.popup.remove();
                    }

                }
        
            });

        }

    });




    if(StallionConfig.getValue("debugModeTrackCursor")){
        document.addEventListener("mousemove", event =>{
            console.log(`(${event.offsetX}, ${event.offsetY})`)
        })
    }
    
}











export {setStallionWindowEvents}