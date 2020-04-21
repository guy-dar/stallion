import {HeuristicsHelper} from "./helper.js"


class SelectionHeuristics{
    constructor(){
        this._maxRegularTextLen = 20;
        this.reference_regexp = /^([A-Za-z\- \,]+)\.(.+)\.(.+)$/
    }

    removeSpecial(s){
        return s.replace(/[^\w\s]/gi, '')
    }
    normalizeSelected(s){
        return this.removeSpecial(s).toLowerCase();
    }
    selectionType(selection){
        if(this.reference_regexp.exec(selection)){
            return "reference";
        }
        return "text";
    }

}


export {SelectionHeuristics}