

class StallionUIStateManager{
    static init(){
        StallionUIStateManager._state = {};
        if(StallionUIStateManager.isInit)
            return;
        StallionUIStateManager._focusStateEvts = [];
        StallionUIStateManager.isInit = true;
    }

    static getSelection(){
        StallionUIStateManager.init();
        // Use for better selection handling. 
        return window.getSelection();
    }

    static getFocusState(){
        StallionUIStateManager.init();
        return StallionUIStateManager._state["focus"];
    }

    static setDefaultFocusState(){
        StallionUIStateManager.setFocusState("document");
    }
    static setFocusState(state){
        StallionUIStateManager.init();

        // GUY TODO:Make a promise
        for(let func of StallionUIStateManager._focusStateEvts){
            func(StallionUIStateManager._state["focus"], state);
        }

        StallionUIStateManager._state["focus"] = state;
    }

    static onFocusStateChange(func){
        StallionUIStateManager.init();
        StallionUIStateManager._focusStateEvts.push(func)
    }

    static focusWidget(widget){
        StallionUIStateManager.setFocusState(widget.focusStateName);        
    }

}

export {StallionUIStateManager}