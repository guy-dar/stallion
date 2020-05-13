
import {stallionDblKeyEvt} from "../utils/ui_utils.js"

function setStallionWindowEvents(){
    window.addEventListener("keydown", stallionDblKeyEvt(".", ()=>{},
        // Double Click
        evt =>{
           
        }))

}


export {setStallionWindowEvents}