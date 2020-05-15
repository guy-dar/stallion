

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
        return _internalGetSelection();
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


function _internalGetSelection(deselect = false){
    if (window.getSelection) {
      var selection = window.getSelection().toString();
      try{
              var contents = window.getSelection().getRangeAt(0).cloneContents();
              var children = contents.children;
              var sTexts = [];
              for(let child of children){
                sTexts.push(child.innerText);
              }
              var multilineSelection = sTexts.join(" ")
              console.log("selection")
      }catch(e){
        console.log(e)
        console.log("Multiline selection error. Perhaps not supported!");
        var multilineSelection = selection;
      }

        if(deselect){
            if (window.getSelection().empty) {  // Chrome
                    window.getSelection().empty();
                } else if (window.getSelection().removeAllRanges) {  // Firefox
                    window.getSelection().removeAllRanges();
                }
        }
    }
    return {selection, multilineSelection};
  }




export {StallionUIStateManager}