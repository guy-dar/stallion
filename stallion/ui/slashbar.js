
import { PDFFindController } from "../../web/pdf_find_controller.js";
import { NullL10n } from "../../web/ui_utils.js";
import {SelectionHeuristics} from "../heuristics/selection.js"
import { StallionActions } from "./actions.js";
import {StallionToastWidget} from "./widgets.js";




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
    case "meow":
      StallionToastWidget.log("Meow indeed..")
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


  dblSlash(){  }

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
