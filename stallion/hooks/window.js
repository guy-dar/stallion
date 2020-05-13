
//import {stallionDblKeyEvt} from "../utils/ui_utils.js"
import {openContextMenu} from "../ui/contextmenu.js"

function setStallionWindowEvents(){
    document.addEventListener("contextmenu", evt =>{
        evt.preventDefault();
        openContextMenu(evt);
    }, 
    false)
}


export {setStallionWindowEvents}