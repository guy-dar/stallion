import { StallionActions } from "./actions.js";
import {StallionToastWidget} from "./widgets.js";
import {DivMaker} from "./common.js";



function _positiveMod(a,b){
  return (a+b) % b;
}



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
      switch (e.key) {
        case "Enter": // Enter
        if (e.target === this.findField) {
            this.runSlashBarCommand(this.findField.value);
            this.close();
          }
          break;
        case "Escape": // Escape
          this.close();
        break;
        case "ArrowUp": 
          e.preventDefault();
          this.hintNavigate(true);
        break;
        case "ArrowDown": 
          e.preventDefault();
          this.hintNavigate(false);
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
    div.getHtmlElement().id = "stallionHintOption" + this.curHintNum;
    div.getHtmlElement().name = hint.cmdName;
    this.curHintNum++;
    div.show(); 
  }

  _resetHintDivs(){
    this.curHintNum = 0;
    this.userHintIndex = null;
    this.hintDivs.innerHTML = '';
  }

  hintNavigate(isUp){
    this.hintDivs
    .querySelectorAll(".stallionHintOptionSelected")
    .forEach(el => {el.classList.remove("stallionHintOptionSelected")});
    
    if(this.curHintNum == 0)
      return;

    if(this.userHintIndex == null){
      this.userHintIndex = 0;
    }
    if(this.userHintIndex == 0){
      this.rememberInput = this.findField.value;
    }

    this.userHintIndex += isUp ? -1: 1;
    this.userHintIndex = _positiveMod(this.userHintIndex, this.curHintNum + 1);
    
    if(this.userHintIndex == 0){
      this.findField.value = this.rememberInput;
    }else{
      var selectedOption = this.hintDivs
      .querySelector(`div[id="stallionHintOption${this.userHintIndex-1}"]`);
 
      selectedOption.classList.add("stallionHintOptionSelected")
      this.findField.value = selectedOption.name + " ";
    }
    


  }


  prepareAllCommands(cmd){
    this.addCommand("config",
      queryArgs => {StallionActions.setUserConfig(queryArgs[1], queryArgs[2])},
      "config: Set config parameters",
      ["config"]);

    this.addCommand("back",
      queryArgs => {window.history.go(-1)},
      "back: Go back",
      ["back"]);

      this.addCommand("toolbar",
      queryArgs => {StallionActions.toggleToolbar()},
      "toolbar: Toggle PDF.js toolbar",
      ["toolbar"]);
      
      this.addCommand("outline",
      queryArgs => {StallionActions.showOutline()},
      "outline: Show document outline",
      ["outline"]);

      this.addCommand("page",
      queryArgs => {StallionActions.gotoPage(queryArgs[1])},
      "page: Go to page",
      ["page"]);
      
      this.addCommand("zoom",
      queryArgs => {
        var q = (queryArgs.length == 3) ? parseInt(queryArgs[2]) : 1;
        q *= (queryArgs[1] == 'out') ? -1 : 1;
        StallionActions.applyZoom(q)
      },
      "zoom (in/out): Zoom page (in/out) according to specified number",
      ["zoom"]);

      this.addCommand("download",
      queryArgs => {      
        StallionActions.download()
      },
      "download: Download PDF file",
      ["download", "file"]);
      
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
      "shortcut: Set user shortcut",
      ["shortcut", "name"]);

      this.addCommand("jump",
      queryArgs => {      
        document.querySelector("#viewerContainer").scrollTo(this.shortcutsDict[queryRest]);        
      },
      "jump: Jump to user shortcut",
      ["jump", "go"]);

      this.addCommand("meow",
      queryArgs => {      
        StallionToastWidget.log("Meow indeed..")
      },
      "meow",
      [""]);

      
      this.addCommand("zenmode",
      queryArgs => {      
        
        document.documentElement.requestFullscreen();

      },
      "zenmode: Enter zen mode",
      ["zenmode", "full", "screen"]);


      this.addCommand("references",
      queryArgs => {      
        StallionActions.gotoReferences();        
      },
      "references: Go to references",
      ["references", "cite", "citation"]);

      this.addCommand("title",
      queryArgs => {      
        StallionActions.gotoTitle(queryArgs[1]);
      },
      "title: Go to section by title",
      ["title", "section", "name"]);

      this.addCommand("preferences",
      queryArgs => {      
        StallionActions.openPreferencesWindow();        
      },
      "preferences: Open preferences window",
      ["preferences", "settings"]);

      

}

}

export { SlashBar };
