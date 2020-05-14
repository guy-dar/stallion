import {StallionUIStateManager} from "../ui/ui_state_manager.js"

// User Interaction

function isKeyEqual(evt, key){
  return evt.key == key;  // Guy TODO: Check compatibility

}
  
  
  function stallionKeyEvt(key, func){
    return evt=>{  
      if(isKeyEqual(evt, key)){
        func(evt);
      }
    }
  }
  
  function stallionDblKeyEvt(key, funcSingleClick, funcDblClick){
    var e = evt => {
      if(isKeyEqual(evt, key)){
        var delta = 300;
        if(!e._stallionTimeoutStarted){
          
          e._stallionTimeoutStarted = setTimeout(()=>{
                    funcSingleClick(evt);
                    e._stallionTimeoutStarted = null;
                  }, delta);
        }else{
          clearTimeout(e._stallionTimeoutStarted);
          e._stallionTimeoutStarted = null;
          funcDblClick();
        }
      }
    }
  
    return e;
  }
  

  export 
{ 
  StallionUIStateManager,
  stallionKeyEvt,
  stallionDblKeyEvt
}
  
  