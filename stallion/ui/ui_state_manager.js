class StallionUIStateManager{

    static getSelection(){
        // Use for better selection handling. 
        return window.getSelection();
    }

    static getFocusState(){
        return StallionUIStateManager._state["focus"];
    }

    static setFocusState(state){
        StallionUIStateManager._state["focus"] = state;
    }


}