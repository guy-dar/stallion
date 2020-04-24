
import { FindState } from "../../web/pdf_find_controller.js";
import { NullL10n } from "../../web/ui_utils.js";
import {SelectionHeuristics} from "../heuristics/selection.js"
import { getPeekBox} from "./peekbox.js"


/**
 * Creates a "search bar" given a set of DOM elements that act as controls
 * for searching or for setting search preferences in the UI. This object
 * also sets up the appropriate events for the controls. Actual searching
 * is done by PDFFindController.
 */
class PDFSuperFindBar {
  constructor(options, eventBus, l10n = NullL10n) {
    this.opened = false;

    this.select_heuristics = new SelectionHeuristics()
    this.findResultsCount = options.findResultsCount || null;
    this.findPreviousButton = options.findPreviousButton || null;
    this.findNextButton = options.findNextButton || null;


    this.eventBus = eventBus;
    this.l10n = l10n;

    
    this.bar = options.bar || null;
    this.findField = options.findField || null;
    this.findMsg = options.findMsg || null;
    
    this.highlightAll = true;
    this.caseSensitive = false;
    this.entireWord = false;


    this.findPreviousButton.addEventListener("click", () => {
      this.dispatchEvent("super", true);
    });

    this.findNextButton.addEventListener("click", () => {
      
      this.dispatchEvent("super", false);
    });

    this.bar.addEventListener("keydown", e => {
      switch (e.keyCode) {
        case 13: // Enter
        if (e.target === this.findField) {
            this.dispatchEvent("super");
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

  reset() {
    this.updateUIState();
  }

  dispatchEvent(type) {
    this.eventBus.dispatch("find", {
      source: this,
      phraseSearch: true,
      type,//: type.substring("find".length),
      query: this.findField.value
    });
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
      this.dispatchEvent("super");
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


  updateUIState(state, previous, matchesCount) {
    let notFound = false;
    let findMsg = "";
    let status = "";

    switch (state) {
      case FindState.FOUND:
        break;

      case FindState.PENDING:
        status = "pending";
        break;

      case FindState.NOT_FOUND:
        findMsg = this.l10n.get("find_not_found", null, "Phrase not found");
        notFound = true;
        break;

      case FindState.WRAPPED:
        if (previous) {
          findMsg = this.l10n.get(
            "find_reached_top",
            null,
            "Reached top of document, continued from bottom"
          );
        } else {
          findMsg = this.l10n.get(
            "find_reached_bottom",
            null,
            "Reached end of document, continued from top"
          );
        }
        break;
    }

    this.findField.classList.toggle("notFound", notFound);
    this.findField.setAttribute("data-status", status);

    Promise.resolve(findMsg).then(msg => {
      this.findMsg.textContent = msg;
      this._adjustWidth();
    });

    this.updateResultsCount(matchesCount);
  }

  updateResultsCount({ current = 0, total = 0 } = {}) {
    if (!this.findResultsCount) {
      return; // No UI control is provided.
    }
    const limit = MATCHES_COUNT_LIMIT;
    let matchesCountMsg = "";

    if (total > 0) {
      if (total > limit) {
        if (typeof PDFJSDev !== "undefined" && PDFJSDev.test("MOZCENTRAL")) {
          // TODO: Remove this hard-coded `[other]` form once plural support has
          // been implemented in the mozilla-central specific `l10n.js` file.
          matchesCountMsg = this.l10n.get(
            "find_match_count_limit[other]",
            {
              limit,
            },
            "More than {{limit}} matches"
          );
        } else {
          matchesCountMsg = this.l10n.get(
            "find_match_count_limit",
            {
              limit,
            },
            "More than {{limit}} match" + (limit !== 1 ? "es" : "")
          );
        }
      } else {
        if (typeof PDFJSDev !== "undefined" && PDFJSDev.test("MOZCENTRAL")) {
          // TODO: Remove this hard-coded `[other]` form once plural support has
          // been implemented in the mozilla-central specific `l10n.js` file.
          matchesCountMsg = this.l10n.get(
            "find_match_count[other]",
            {
              current,
              total,
            },
            "{{current}} of {{total}} matches"
          );
        } else {
          matchesCountMsg = this.l10n.get(
            "find_match_count",
            {
              current,
              total,
            },
            "{{current}} of {{total}} match" + (total !== 1 ? "es" : "")
          );
        }
      }
    }
    Promise.resolve(matchesCountMsg).then(msg => {
      this.findResultsCount.textContent = msg;
      this.findResultsCount.classList.toggle("hidden", !total);
      // Since `updateResultsCount` may be called from `PDFFindController`,
      // ensure that the width of the findbar is always updated correctly.
      this._adjustWidth();
    });
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

    // The find bar has an absolute position and thus the browser extends
    // its width to the maximum possible width once the find bar does not fit
    // entirely within the window anymore (and its elements are automatically
    // wrapped). Here we detect and fix that.
    this.bar.classList.remove("wrapContainers");

    const findbarHeight = this.bar.clientHeight;
    const inputContainerHeight = this.bar.firstElementChild.clientHeight;

    if (findbarHeight > inputContainerHeight) {
      // The findbar is taller than the input container, which means that
      // the browser wrapped some of the elements. For a consistent look,
      // wrap all of them to adjust the width of the find bar.
      this.bar.classList.add("wrapContainers");
    }
  }
}

export { PDFSuperFindBar };
