
import { PDFFindController } from "../../web/pdf_find_controller.js";
import { NullL10n } from "../../web/ui_utils.js";
import {SelectionHeuristics} from "../heuristics/selection.js"
import { getPeekBox} from "./peekbox.js"
import { StallionActions } from "./actions.js";
import {StallionToastWidget} from "./widgets.js";

class SlashBarController extends PDFFindController{
  _handleScroll(evt){
    if(evt.source._peekMatches){
      document.querySelector("#viewerContainer")
              .scrollTo(evt.source._peekPosLeft, evt.source._peekPosTop);
      
    }
  }

  _preprocessSuperMatch(){
    var query = this._query;
    var queryArgs = query.split(" ");
    var cmd = queryArgs[0];
    var queryRest = queryArgs.slice(1).join(" ");
    switch(cmd){
      case "back":
        window.history.go(-1);
        return ["",""]
      break;
      case "toolbar":
        document.getElementById("toolbarContainer").classList.toggle("hidden");
        return ["",""]
      break;
      case "outline":
        document.getElementById("sidebarToggle").click();
        document.getElementById("viewOutline").click();
        return ["",""]
      break;
      case "refer":
        this._peekMatches = true;
        var q = queryArgs[1];
        return  [q, "refer"];
      break;
      case "fpeek":
        this._peekMatches = true;
        return  [queryRest, "find"];
      break;
      case "fgoto":
        this._peekMatches = false;
        return  [queryRest, "find"];
      break;
      case "page":
        document.getElementById("pageNumber").value = queryArgs[1];
        document.getElementById("pageNumber").dispatchEvent(new Event("change"));
        return ["", ""];
      break; 
      case "zoom":
        var zoomBtn = (queryArgs[1] == 'in') ? document.getElementById("zoomIn") : document.getElementById("zoomOut");
        var q = (queryArgs.length == 3) ? queryArgs[2] : 1;

        for(var i = 0; i < q; i++)
          zoomBtn.click();
        return ["",""];
      break;
      case "download":
        this._eventBus.dispatch("download",{source: this})
        return ["",""];
      break;
      case "shortcut":
      case "name":
      case "dub":
        if(this.shortcutsDict == undefined)
            this.shortcutsDict = {} //Guy TODO: Maybe move it later to constructor

        if(this.shortcutsDict[queryRest] == undefined){
          this.shortcutsDict[queryRest] = [document.querySelector("#viewerContainer").scrollLeft,
                                            document.querySelector("#viewerContainer").scrollTop];
        }else{
          console.log("Cannot set shortcut. already exists.")
        }
        return ["",""];
      break;
      case "jump":
        document.querySelector("#viewerContainer").scrollTo(this.shortcutsDict[queryRest]);
        return ["",""];
      break;
      default:
        alert("Cannot understand command. Are you stupid?");
        return ["",""];
    }  
    
  }


  _calculateSuperMatch(pageIndex, query, queryType) {

    if(queryType == "find"){
      this._calculateMatch(pageIndex, query);
      return;
    }
    if(queryType == "refer"){
        
    }
    if(queryType == "media"){
        
    }
  }
}



function runSlashBarCommand(query){
  var queryArgs = query.split(" ");
  var cmd = queryArgs[0];

  switch(cmd){
    case "config":
      StallionActions.setUserConfig(queryArgs[1], queryArgs[2]);
    break;
    case "back":
      window.history.go(-1);
    break;
    case "toolbar":
      StallionActions.toggleToolbar()
    break;
    case "outline":
      StallionActions.showOutline()
    break;
    case "page":
      StallionActions.gotoPage(queryArgs[1])  // Not necessary to parse as int
    break; 
    case "zoom":
      var q = (queryArgs.length == 3) ? parseInt(queryArgs[2]) : 1;
      q *= (queryArgs[1] == 'out') ? -1 : 1;
      StallionActions.applyZoom(q);
    break;
    case "download":
      this._eventBus.dispatch("download",{source: this})
    break;
    case "shortcut":
    case "name":
    case "dub":
    var queryRest = queryArgs[1];
    if(!this.shortcutsDict)
          this.shortcutsDict = {} //Guy TODO: Maybe move it later to constructor

      if(!this.shortcutsDict[queryRest]){
        this.shortcutsDict[queryRest] = [document.querySelector("#viewerContainer").scrollLeft,
                                          document.querySelector("#viewerContainer").scrollTop];
      }else{
        StallionToastWidget.log("Cannot set shortcut. already exists.")
      }
    break;
    case "jump":
      document.querySelector("#viewerContainer").scrollTo(this.shortcutsDict[queryRest]);
    break;
    default:
      StallionToastWidget.log("Cannot understand command. Are you stupid?");
  }  
  
}



class SlashBar {
  constructor(options, eventBus, l10n = NullL10n) {
    this.opened = false;

    this.select_heuristics = new SelectionHeuristics()
    this.eventBus = eventBus;
    this.l10n = l10n;
    
    this.bar = options.bar || null;
    this.findField = options.findField || null;
    this.findMsg = options.findMsg || null;

    this.bar.addEventListener("keydown", e => {
      switch (e.keyCode) {
        case 13: // Enter
        if (e.target === this.findField) {
            runSlashBarCommand(this.findField.value);
            this.close();
          }
          break;
        case 27: // Escape
          this.close();
          break;
      }
    });
    this.eventBus._on("resize", this._adjustWidth.bind(this));
  }



  deselect(){
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
      }catch(e){
        console.log(e)
        console.log("Multiline selection error. Perhaps not supported!");
        var multilineSelection = selection;
      }

      if (window.getSelection().empty) {  // Chrome
        window.getSelection().empty();
      } else if (window.getSelection().removeAllRanges) {  // Firefox
        window.getSelection().removeAllRanges();
      }
    }
    console.log(selection)
    return {selection, multilineSelection};
  }

  dblSlash(){
      // De-select
      var {selection, multilineSelection} = this.deselect();
      console.log(multilineSelection)
    
      if(selection==''){
        this.findField.value = "fpeek ";
        this.open();
        this.deselect();     
    }

    if(this.select_heuristics.selectionType(selection) == 'reference'){  
        this.getReferenceInfo(multilineSelection);
    } else {
      // Process Selection
      var query = "fpeek " + selection;
      // Run query
      this.findField.value = query;
      // this.dispatchEvent("super");
    }

  }

  getReferenceInfo(selection){
    // selection = this.select_heuristics.normalizeSelected(selection);

    var url = "https://api.crossref.org/works?query.bibliographic=";
    // "https://api.labs.cognitive.microsoft.com/academic/v1.0/evaluate?expr='" + encodeURI(selection) + "'"; 
    selection = selection.replace(/\s+/g, ' ')
    var {iframeBody} = getPeekBox();
    iframeBody.innerHTML = "<div style='font-family:Cambria;'></div>"
    var iframeDoc = iframeBody.querySelector("div");
    peekBoxContainer.classList.remove("hidden")

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
                  
                  abs_span.appendChild(document.createTextNode(abs_json['abstract']));
                  iframeDoc.appendChild(abs_span);

                }
        };

        abstract_xhr.send(); 
          
      }
    };
    xhr.send();
  
  }

  open() {
    this.eventBus.dispatch("findbaropened", { source: this });
    if (!this.opened) {
      this.opened = true;
      this.bar.classList.remove("hidden");
    }
    this.findField.value = '';
    this.findField.select();
    this.findField.focus();

    this._adjustWidth();
  }

  close() {
    if (!this.opened) {
      return;
    }
    this.opened = false;
    this.bar.classList.add("hidden");
  }


  /**
   * @private
   */
  _adjustWidth() {
    if (!this.opened) {
      return;
    }
    this.bar.classList.remove("wrapContainers");

    const findbarHeight = this.bar.clientHeight;
    const inputContainerHeight = this.bar.firstElementChild.clientHeight;

    if (findbarHeight > inputContainerHeight) {
      this.bar.classList.add("wrapContainers");
    }

  }
}

export { SlashBar };
