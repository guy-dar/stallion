import {StallionWindowWidget} from "./widgets.js";
import {DivMaker} from "./common.js";

class PreferencesWindow{
    
    static open(){
        if(!PreferencesWindow.isInit){
            PreferencesWindow.isInit = true;
       }
       PreferencesWindow.window = new StallionWindowWidget(true);
       var myWindow = PreferencesWindow.window;
       var outerDiv = DivMaker.create('.stallionDummy', myWindow.iframeBody);
       outerDiv.style.display = 'table';
       var innerDiv = DivMaker.create('.stallionDummy', outerDiv);
       innerDiv.innerHTML = "<br><br><b>Preferences</b>"

    }

}



export {PreferencesWindow}