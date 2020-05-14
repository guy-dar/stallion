
//import {stallionDblKeyEvt} from "../utils/ui_utils.js"
import {openContextMenu} from "../ui/contextmenu.js"
import {StallionConfig} from "../config/utils.js";


function setStallionWindowEvents(){    
    if(StallionConfig.getValue("stallionContextMenu")){
        document.addEventListener("contextmenu", evt =>{
            evt.preventDefault();
            openContextMenu(evt);
        }, 
        false)
    }
}


export {setStallionWindowEvents}