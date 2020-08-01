import {HeuristicsHelper} from "./helper.js"
import {StallionConfig, StallionMemory} from "../config/utils.js"
import {stallionRegexpMatch, PageCoordinateTranslation } from "../utils/text.js";
import {StallionPageUtils} from "../utils/page_utils.js";
import {StallionSnippingSelection, StallionSmoothSelection} from "../ui/selection.js";



class RangeTracker{
    constructor(mergeFunc = null, initFunc = null){
        this.ranges = []
        this.keys = []
        this.helper = new HeuristicsHelper();
        
        
        if(mergeFunc){
            this._mergeFunc = mergeFunc;
        }else{
            this._mergeFunc = function(arr, val){
                arr+= [val];
                return arr;
            }
        }

        if(initFunc){
            this._initFunc = initFunc;
        }else{
            this._initFunc = function(val){
                return val;
            }
        }

    }

    // GUY TODO: Change to be more memory efficient
    append(key, value){
        if(this.keys.length == 0 || this.helper._last(this.keys) != key){
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
        this.fontTracker = new RangeTracker(this._fontMergeFunc);
    }


    reportTextAction(ctx, fontData, scaledX, scaledY, text){
        var font = this.helper.fontNormalizer(fontData);
        var {x,y,w,h} = PageCoordinateTranslation.ctxToCanvas(ctx, scaledX, scaledY, font.fontSize, font.fontSize);
        // GUY TODO: !!!!!!!!!!!!!!!!! FIX ONCE YOU UNDERSTAND WHAT'S GOING ON!!!!!!!!!
        this.helper.incrementDict(this._fonts, this.helper._fontFullName(font));
        this.fontTracker.append(this.helper._fontFullName(font), {text, pos: {x, y, w, h}});
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

    _fontMergeFunc = function(fullText, val){
        var _surmiseIfWhitespace = function(pos1, pos2){
            var cutoffX = 0;    // GUY TODO: Fix
            if((pos2.x  -pos1.w - pos1.x) >= cutoffX * pos2.w)
                return true;
            return false;   // GUY TODO: What about line break
        }
    
        if(_surmiseIfWhitespace(fullText.pos, val.pos)){
            fullText.text += ' ';
        }
        fullText.text += val.text;
        fullText.pos = val.pos;
        if(!fullText.morePos)
            fullText.morePos = [];
        fullText.morePos.push(val);
        
        return fullText;
    }

}




export {PageHeuristics}
