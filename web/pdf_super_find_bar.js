
import { FindState } from "./pdf_find_controller.js";
import { NullL10n } from "./ui_utils.js";
import {SelectionHeuristics} from "../src/shared/heuristics.js"


function getReferenceInfo(selection){
  var url = "https://api.crossref.org/works?query.bibliographic=" + encodeURI(selection);
  const xhr = new XMLHttpRequest();
  console.log(selection);  

  selection = selection.replace(/\s+/g, ' ')
  xhr.open('GET', url);
  xhr.responseType = 'json';
  xhr.onreadystatechange = ()=>{
    if(xhr.readyState == 4){
      var json = xhr.response;
      var item = json.message.items[0];
      console.log(json);
      $("#peekBoxContainer")[0].classList.remove("hidden");
      var iframeDoc = $("#peekBox")[0].contentDocument.documentElement
      iframeDoc.innerHTML = "<body></body>";
      var iframeBody = iframeDoc.getElementsByTagName("body")[0];
      iframeBody.style.backgroundColor = "white";

      // Title
      var title_span = $("<div>");
      title_span.text("Title ");
      title_span.append( item.title);        
      title_span.appendTo(iframeBody);


      // URL to item
      var a_href_span = $("<div>");
      a_href_span.text("URL ");
      var a_href = $("<a>");
      a_href.attr("href", item.URL);        
      a_href.append( item.URL);        
      a_href.appendTo(a_href_span);
      a_href_span.appendTo(iframeBody);

      // Reference Count
      var ref_count_span = $("<div>");
      ref_count_span.text("References Count ");
      ref_count_span.append( item["references-count"]);        
      ref_count_span.appendTo(iframeBody);

      // Citation Count
      var cite_span = $("<div>");
      cite_span.text("Cite Count ");
      cite_span.append( item['is-referenced-by-count']);        
      cite_span.appendTo(iframeBody);


    }
  };
  xhr.send();

}




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
      if (window.getSelection().empty) {  // Chrome
        window.getSelection().empty();
      } else if (window.getSelection().removeAllRanges) {  // Firefox
        window.getSelection().removeAllRanges();
      }
    }
    return selection;
  }

  dblSlash(){
    // De-select
  var selection = this.deselect();
  if(selection==''){
    this.findField.value = "fpeek ";
    this.open();
    this.deselect();
    
  }
  if(this.select_heuristics.selectionType(selection) == 'reference'){  
    getReferenceInfo(selection);
  }else{
    // Process Selection
    var query = "fpeek " + selection;
    // Run query
    this.findField.value = query;
    this.dispatchEvent("super");
  }


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
