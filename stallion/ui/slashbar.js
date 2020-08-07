import { StallionActions } from "./actions.js";
import {StallionToastWidget} from "./widgets.js";
import {DivMaker} from "./common.js";







class SlashBar {
  constructor(options, eventBus) {
    this.opened = false;
    this.eventBus = eventBus;
    
    this.bar = options.bar || null;
    this.commands = {};
    this.prepareAllCommands();
    this.hintDivs = DivMaker.create('.stallionHintDivs', this.bar);
    this.findField = options.findField || null;
    this.findMsg = options.findMsg || null;

    // Guy TODO: Make sure it gets all the query and doesn't lose last character
    this.bar.addEventListener("keyup", e => {
      switch (e.keyCode) {
        case 13: // Enter
        if (e.target === this.findField) {
            this.runSlashBarCommand(this.findField.value);
            this.close();
          }
          break;
        case 27: // Escape
          this.close();
          break;
        default:
          if (e.target === this.findField) {
            console.log(this.findField.value)
            this.slashBarHint(this.findField.value);
          }
        
      }
    });
  }

  runSlashBarCommand(query){
    var queryArgs = query.split(" ");
    var cmd = queryArgs[0];
    if(cmd in this.commands){
      this.commands[cmd].func(queryArgs);
    }else{
      StallionToastWidget.log("Cannot understand command. Are you stupid?");
    }
  }


  dblSlash(){  }

  open() {
    this._resetHintDivs();
    if (!this.opened) {
      this.opened = true;
      this.bar.classList.remove("hidden");
    }
    this.findField.value = '';
    this.findField.select();
    this.findField.focus();

  }


  addCommand(cmdName, func,  title, keywords){
    this.commands[cmdName] = {title, cmdName, keywords: keywords.join(),
    func};
  }


  close() {
    if (!this.opened) {
      return;
    }
    this.opened = false;
    this.bar.classList.add("hidden");
  }


  

  slashBarHint(query){
    var relevantHints = [];
    this._resetHintDivs();
    if(query.length == 0){
      return;
    }
    Object.keys(this.commands).forEach(key => {
        var hint = this.commands[key];
        if(hint.keywords.indexOf(query) != -1){
          relevantHints[relevantHints.length] = {hint, score: 1};
        }      
    });

    var maxSlashBarHints = 5;
    for(var i = 0; i < maxSlashBarHints && i < relevantHints.length; i++){
        var h = relevantHints[i].hint;
        this._appendHintDiv(h);
    }


  }

  _appendHintDiv(hint){
    var div = new DivMaker('.stallionHintOption', this.hintDivs);
    div.getHtmlElement().innerText = hint.title;
    div.show(); 
  }

  _resetHintDivs(){
    this.hintDivs.innerHTML = '';
  }



  prepareAllCommands(cmd){
    this.addCommand("config",
      queryArgs => {StallionActions.setUserConfig(queryArgs[1], queryArgs[2])},
      "config",
      ["config"]);

    this.addCommand("back",
      queryArgs => {window.history.go(-1)},
      "back",
      ["back"]);

      this.addCommand("toolbar",
      queryArgs => {StallionActions.toggleToolbar()},
      "toolbar",
      ["toolbar"]);
      
      this.addCommand("outline",
      queryArgs => {StallionActions.showOutline()},
      "outline",
      ["outline"]);

      this.addCommand("page",
      queryArgs => {StallionActions.gotoPage(queryArgs[1])},
      "page",
      ["page"]);
      
      this.addCommand("zoom",
      queryArgs => {
        var q = (queryArgs.length == 3) ? parseInt(queryArgs[2]) : 1;
        q *= (queryArgs[1] == 'out') ? -1 : 1;
        StallionActions.applyZoom(q)
      },
      "zoom",
      ["zoom"]);

      this.addCommand("download",
      queryArgs => {      
        this._eventBus.dispatch("download",{source: this})
      },
      "download",
      ["download"]);
      
      this.addCommand("shortcut",
      queryArgs => {      
        var queryRest = queryArgs[1];
        if(!this.shortcutsDict)
              this.shortcutsDict = {} //Guy TODO: Maybe move it later to constructor
    
          if(!this.shortcutsDict[queryRest]){
            this.shortcutsDict[queryRest] = [document.querySelector("#viewerContainer").scrollLeft,
                                              document.querySelector("#viewerContainer").scrollTop];
          }else{
            StallionToastWidget.log("Cannot set shortcut. already exists.")
          }
    
      },
      "shortcut",
      ["shortcut"]);

      this.addCommand("jump",
      queryArgs => {      
        document.querySelector("#viewerContainer").scrollTo(this.shortcutsDict[queryRest]);        
      },
      "jump",
      ["jump"]);

      this.addCommand("meow",
      queryArgs => {      
        StallionToastWidget.log("Meow indeed..")
      },
      "meow",
      ["meow"]);
  
}

}

export { SlashBar };
