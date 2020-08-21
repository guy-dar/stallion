import {HeuristicsHelper} from "./helper.js"
import {StallionConfig, StallionMemory} from "../config/utils.js"
import {stallionRegexpMatch, PageCoordinateTranslation } from "../utils/text.js";
import {StallionPageUtils} from "../utils/page_utils.js";
import {StallionSnippingSelection, StallionSmoothSelection} from "../ui/selection.js";



class RangeTracker{
    constructor(mergeFunc = null, initFunc = null, keepKeyFunc = null){
        this.ranges = []
        this.keys = []
        this.helper = new HeuristicsHelper();
        this.curKey = null;


        this._mergeFunc = mergeFunc || function(arr, val){
            arr+= [val];
            return arr;
        };

        this._initFunc = initFunc || function(val){
            return val;
        }

        this._keepKeyFunc = keepKeyFunc || function(key){
            return true;
        }

    }


    getAll(keys){
        var allRanges = [];
        for(var i = 0; i < this.keys.length; i++){
            var key = this.keys[i];
            for(var j = 0; j < keys.length; j++){
                if(key == keys[j]){
                    allRanges[allRanges.length] = this.ranges[i];
                    break;
                }
            }
        }
        return allRanges;
    }



    // GUY TODO: Change to be more memory efficient
    append(key, value){
        var keyChanged = this.curKey != key;
        this.curKey = key;
        if(!this._keepKeyFunc(key)){ // GUY TODO: If function non-deterministic problems may arise
            return;
        }

        if(keyChanged){
            this.ranges.push(this._initFunc(value));
            this.keys.push(key);
        }else{
            var curArr = this.helper._last(this.ranges);
            this.ranges[this.ranges.length - 1] = this._mergeFunc(curArr, value);
        }
    }

}




class PageHeuristics{
    constructor(doc_handler, pageIdx){
        this.doc_heuristics = doc_handler.docHeuristics;
        this._fontRanges = {};
        this.pageIdx = pageIdx;
        this.startRendering();
    }

    
    startRendering(){
        this.debugMode = StallionConfig.getValue("debugMode");
        this._autoInternalLinks = [];
        this.helper = new HeuristicsHelper();
        this._fonts = {};
        this.fontTracker = new RangeTracker(this._fontMergeFunc,null,
                                            this._fontKeepKeyFunc);
    }


    reportTextAction(ctx, fontData, scaledX, scaledY, text, width){
        var font = this.helper.fontNormalizer(fontData);
        var {x,y,w,h} = PageCoordinateTranslation.ctxToCanvas(ctx, scaledX, scaledY, font.fontSize, font.fontSize);
        // GUY TODO: !!!!!!!!!!!!!!!!! FIX ONCE YOU UNDERSTAND WHAT'S GOING ON!!!!!!!!!
        w = width;
        this.helper.incrementDict(this._fonts, this.helper._fontFullName(font));
        this.fontTracker.append(this.helper._fontFullName(font), {text, pos: {x, y, w, h}, 
                                        fontSize:font.fontSize});
    }

    reportImageAction(ctx,x, y, w, h, type){
        
    }


    finishedRenderingContext(curCtx,viewport, transform){

        console.log(this.fontTracker);
        this.doc_heuristics._propagateDocumentStyle(this._fonts)
        
        if(!StallionConfig.isValue("textSelection", "none")){
            
        }
        
    }




    analyzeTextLayer(textLayer, pageView){
        
    }

    


    _getPhrasePositions(pageContent, textLayer, query, qName) {
        var {matches, matchLengths, matchNames} = stallionRegexpMatch(query, pageContent, qName);
        var textLayerMatches = textLayer._convertMatches(matches, matchLengths);
        var positions = [];        
        
        for(var ii = 0; ii < textLayerMatches.length; ii++){
            var divMatch = textLayerMatches[ii];
            var pos = this._fromTextDivToPosition({beginDiv: textLayer.textDivs[divMatch.begin.divIdx],
                beginOffset: divMatch.begin.offset,
                endDiv:  textLayer.textDivs[divMatch.end.divIdx],
                endOffset: divMatch.end.offset,
               });

            positions.push([pos, matchNames[ii]]);
        }
        return positions;
    }

    

    _fromTextDivToPosition(matchInfo){
        var canvas = matchInfo.beginDiv.closest(".page").querySelector("canvas");
        var ctx = canvas.getContext('2d');
        var { left: canvasLeft, top: canvasTop} = canvas.getBoundingClientRect();
        var wRatio = canvas.width/canvas.offsetWidth;
        var hRatio = canvas.width/canvas.offsetWidth;
        
        var {beginDiv, beginOffset, endDiv, endOffset} = matchInfo;
        var selection = document.createRange();
        selection.setStart(beginDiv.firstChild, beginOffset)
        selection.setEnd(endDiv.firstChild, endOffset)
        var rects = selection.getClientRects();
        var results = [];

        for(var i = 0; i < rects.length; i++){
            var {left, top, width, height} = rects[i];
                        results.push({'left':  left-canvasLeft, 
                        'top': top-canvasTop, 
                        'width':   width,
                        'height': height});
                        
        }

        return results;
    }

    // More functions

    _fontKeepKeyFunc = function(key){
        // GUY TODO: Fix
        return key.indexOf("+NimbusRomNo9L-Regu@") == -1
    }


    _fontMergeFunc = function(fullText, val){
        var _surmiseIfWhitespace = function(pos1, pos2){
            var cutoffX = 0.8;    // GUY TODO: Fix
            if(Math.abs(pos2.x  -pos1.w - pos1.x) >= cutoffX * val.fontSize)
                return true;
            return false;   // GUY TODO: What about line break
        }
    
        if(_surmiseIfWhitespace(fullText.pos, val.pos)){
            fullText.text += ' ';
        }
        fullText.text += val.text;
        fullText.pos = val.pos;
        return fullText;
    }

}




export {PageHeuristics}
