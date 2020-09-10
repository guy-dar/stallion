import {StallionConfig} from "../config/utils.js"
import {StallionToastWidget, StallionWindowWidget} from "./widgets.js"
import { StallionUIStateManager } from "../utils/ui_utils.js";
import {PreferencesWindow} from "../ui/preferences.js";
import {getStallionCommentWindow} from "./comment_window.js";

class StallionActions {

    static openCommentWindow({x, y, pageIdx}){
      getStallionCommentWindow({x, y, pageIdx});
    }

    static toggleToolbar(){
        document.getElementById("toolbarContainer").classList.toggle("hidden");
    }

    static gotoReferences(){
      return this.gotoTitle("References");
    }

    static gotoTitle(title){
      StallionToastWidget.log("Not implemented yet.. ");
    }


    static openPreferencesWindow(){
      PreferencesWindow.open();
    }


    static showOutline(){
        document.getElementById("sidebarToggle").click();
        document.getElementById("viewOutline").click();
    }


    static gotoPage(pageNum){
        document.getElementById("pageNumber").value = pageNum;
        document.getElementById("pageNumber").dispatchEvent(new Event("change"));
    }

    static applyZoom(zoomVal = 1){
        var zoomBtn = zoomVal > 0 ? document.getElementById("zoomIn") : document.getElementById("zoomOut");
        zoomVal = Math.abs(zoomVal)

        for(var i = 0; i < zoomVal; i++)
          zoomBtn.click();
    }

    static download(){
      StallionUIStateManager.getEventBus().dispatch("download",{source: this});
    }

    static peekMatches(selection){
      // GUY TODO: Check functionality. Make sure find controller state machine doesn't get broken
      StallionUIStateManager.getViewerApplication().pdfViewer.findController.executeCommand("find",{query: selection, peekMatches: true});
    }




    static setUserConfig(key, value){
      if(!(key in StallionConfig.userConfigurable)){
        StallionToastWidget.log("Invalid configuration parameter");
        return;
      }
      var valueSpecs = StallionConfig.userConfigurable[key];
      switch(valueSpecs){
        case "bool":
          value = (value == 'true');
        break;
      }
      StallionConfig.setValue(key, value);

    }

    static getReferenceInfo(selection){
      return _getReferenceInfo(selection)
    }

}






function _getReferenceInfo(selection){
  console.log(selection)
  // selection = this.select_heuristics.normalizeSelected(selection);
  var url = "https://api.crossref.org/works?query.bibliographic=";
  // "https://api.labs.cognitive.microsoft.com/academic/v1.0/evaluate?expr='" + encodeURI(selection) + "'"; 
  selection = selection.replace(/\s+/g, ' ')
  var {container, iframeBody} = new StallionWindowWidget(true);
  iframeBody.innerHTML = "<br/><br/><br/><div style='font-family:Cambria;'></div>"
  var iframeDoc = iframeBody.querySelector("div");
  

  const xhr = new XMLHttpRequest();
  xhr.open('GET', url + encodeURI(selection));
  xhr.responseType = 'json';

  xhr.onreadystatechange = ()=>{
    if(xhr.readyState == 4){
      var json = xhr.response;
      var item = json.message.items[0];
      console.log(json);
      iframeDoc.style.backgroundColor = "white";
      // Title
      var title_span = document.createElement("b");
      title_span.appendChild(document.createTextNode(item.title));        
      iframeDoc.appendChild(title_span);


      // URL to item
      var a_href_span = document.createElement("div");
      var a_href = document.createElement("a");
      // a_href_span.innerText = "URL ";
      a_href.href = item.URL;       
      a_href.target = "_blank"; 
      a_href.innerText = item.URL;        
      a_href_span.appendChild( a_href );
      iframeDoc.appendChild(a_href_span);
  
      // Citation Count
      var cite_span = document.createElement("div");
      cite_span.innerText = "Cited by " + item['is-referenced-by-count'];        
      iframeDoc.appendChild(cite_span);
      
      // Abstract
      var abs_span = document.createElement("div");
      abs_span.innerHTML = "<b>Abstract</b><br/> ";
      var abstract_url = 'https://api.semanticscholar.org/v1/paper/';
      var abstract_xhr = new XMLHttpRequest();
      abstract_xhr.open('GET', abstract_url + item.DOI);
      abstract_xhr.responseType = 'json';

      abstract_xhr.onreadystatechange = ()=>{
          if(abstract_xhr.readyState == 4){
                var abs_json = abstract_xhr.response;
                var abs_paragraph = document.createElement("p")
                abs_paragraph.classList.add("ellipsisParagraph")
                abs_span.appendChild(abs_paragraph)
                abs_paragraph.appendChild(document.createTextNode(abs_json['abstract']));
                iframeDoc.appendChild(abs_span);

              }
      };

      abstract_xhr.send(); 
        
    }
  };
  xhr.send();

}


export {StallionActions}