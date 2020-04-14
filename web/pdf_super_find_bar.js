
import { FindState } from "./pdf_find_controller.js";
import { NullL10n } from "./ui_utils.js";

/**
 * Creates a "search bar" given a set of DOM elements that act as controls
 * for searching or for setting search preferences in the UI. This object
 * also sets up the appropriate events for the controls. Actual searching
 * is done by PDFFindController.
 */
class PDFSuperFindBar {
  constructor(options, eventBus, l10n = NullL10n) {
    this.opened = false;
    this.eventBus = eventBus;
    this.l10n = l10n;

    
    this.bar = options.bar || null;
    this.findField = options.findField || null;
    this.findMsg = options.findMsg || null;
    
    this.highlightAll = true;
    this.caseSensitive = false;
    this.entireWord = false;

    this.findResultsCount = null;
    this.findPreviousButton =  null;
    this.findNextButton = null;

    this.findField.addEventListener("input", () => {
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
      type,
      query: this.findField.value
    });
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

    }

    this.findField.classList.toggle("notFound", notFound);
    this.findField.setAttribute("data-status", status);

    Promise.resolve(findMsg).then(msg => {
      this.findMsg.textContent = msg;
      this._adjustWidth();
    });

  }


  open() {
    this.eventBus.dispatch("findbaropened", { source: this });
    if (!this.opened) {
      this.opened = true;
      this.bar.classList.remove("hidden");
    }
    this.findField.select();
    this.findField.focus();

    this._adjustWidth();
  }

  close() {
    if (!this.opened) {
      return;
    }
    this.opened = false;
    this.findField.value = '';
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
