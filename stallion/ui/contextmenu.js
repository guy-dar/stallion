import {makeEscapable, StallionLookAndFeel} from "./common.js";
import {StallionUIStateManager} from "./ui_state_manager.js";
import {StallionActions} from "./actions.js"
import { StallionToastWidget } from "./widgets.js";
var stallionContextMenuId = "stallionContextMenu"

class StallionContextMenuItem {

    constructor(name, func){
        this.name = name; 
        this.func = func;
    }

}



class StallionContextMenu {
    constructor(){
        this._isLoaded = false;
        this._items = this.getAllItems();

        StallionLookAndFeel.hideOnUnfocus(this);
        this.div = document.getElementById(stallionContextMenuId);
        if(!this.div){
            this.div = document.createElement("div");
            this.div.id = stallionContextMenuId;
            makeEscapable(this.div, ()=>{this.hide()})
            document.querySelector("body").appendChild(this.div);
        }
        this.hide();
        // this.loadEntirely = new Promise(()=>{this.startLoading()}); // GUY TODO: DO it in the right way

    }

    get focusStateName(){
        return "contextmenu";
    }

    getDiv(){
        return this.div;
    }

    _internalOnClickFunc(i){
        return e=>{
            e.preventDefault()
            this._items[i].func();
            this.hide();
        };
    }

    _constructMenuItems(){
        var menuOptions = document.createElement("ul");
        menuOptions.classList.add("stallionContextMenuUL")

        for(var i = 0; i < this._items.length; i++){
            var item = this._items[i];
            var itemDiv = document.createElement("li");
            itemDiv.classList.add("stallionContextMenuItem");
            itemDiv.innerText = item.name;
            itemDiv.onmousedown = this._internalOnClickFunc(i);
            menuOptions.appendChild(itemDiv)
        }
        this.div.appendChild(menuOptions);
    }

    
    async startLoading(){   // GUY TODO: Check this is done this way
        if(this._isLoaded)
            return;
        this._constructMenuItems();
        this._isLoaded = true;
    }

    reveal(mouseX, mouseY){
        StallionUIStateManager.focusWidget(this);
        this.div.style.left = `${mouseX}px`;
        this.div.style.top = `${mouseY}px`;

        this.div.classList.remove("hidden")
        console.log(this.div)
    }

    hide(){
        this.div.classList.add("hidden");
    }

    getAllItems(){
        return [
            new StallionContextMenuItem("Comment", ()=>{
                // GUY TODO: Fix
                StallionToastWidget.log("Not implemented yet.")

            }),

            new StallionContextMenuItem("Peek Definition", ()=>{
                StallionActions.peekMatches(StallionUIStateManager.getSelection().selection);
            }),
            new StallionContextMenuItem("Lookup Reference Data..", ()=>{
                StallionActions.getReferenceInfo(StallionUIStateManager.getSelection().multilineSelection);
            }),

            new StallionContextMenuItem("Preferences", ()=>{
                StallionActions.openPreferencesWindow();
            }),

            new StallionContextMenuItem("Download", ()=>{
                StallionActions.download();
            }),


        ]

    }


}





var contextMenu;

function openContextMenu(evt){
    
    if(!contextMenu)
        contextMenu = new StallionContextMenu();
    
    contextMenu.startLoading().then(()=>{contextMenu.reveal(evt.pageX, evt.pageY)})
}


export {openContextMenu}