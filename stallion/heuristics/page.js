import {HeuristicsHelper} from "./helper.js"
import {StallionConfig} from "../config/utils.js"
import { stallionRegexpMatch, PageCoordinateTranslation } from "../utils/text.js";
var stallionConfig = new StallionConfig();

class PageHeuristics{
    constructor(doc_heuristics, pageIdx){
        this.doc_heuristics = doc_heuristics;
        this._fontRanges = {};
        this.pageIdx = pageIdx;
        this.startRendering();
    }

    startRendering(){
        this.debugMode = stallionConfig.getValue("debugMode");
        this._autoInternalLinks = [];
        this.helper = new HeuristicsHelper();
        this._prevLineFonts = null;
        this._curLineFonts = [];
        this._textBlocks = [];
        this._fonts = [];
        this._lineBeginning = [];
        this._curFontCtx = null;
        this._images = [];
        this.idx = 0;
        // this._fontRangePromise = new Promise();
        this._fontRanges = [];

        // Set primary estimates
        this._maxImgDim = 1000;
    }


    isTextBlockShared(newFontCtx, curTextBlock, prevFontCtx){
        if(!curTextBlock)
            return false;

        // Column jump
        if(this.helper._isColumnJump(newFontCtx, prevFontCtx)){
            return false
        }

        // Too distant lines
        if(newFontCtx.y - prevFontCtx.y > 2 * Math.max(prevFontCtx.h, newFontCtx.h) ){
            return false;
        }
        

        return this.helper.isDictInArray(newFontCtx.font, curTextBlock.fonts);  // GUY TODO: Fix. should be after the line is processed. Before is just approximation
    }

    handleStrokeAction(ctx, strokeColor){
        // this.reportStrokeAction(ctx, fontData, scaledX, scaledY);
        if(stallionConfig.getValue("darkMode")){
            ctx.fillStyle = "#ffffff"
            strokeColor = "#ffffff"
        }
        return {ctx, strokeColor};

    }

    static defaultSettings(ctx){
        var fillStyle = null, strokeStyle = null;
        if(stallionConfig.getValue("darkMode")){
            fillStyle = "#ffffff"
            strokeStyle = "#ffffff"
        }
        return {ctx: ctx, strokeStyle, fillStyle};
    }

    handlePathAction(ctx){
        // this.reportPathAction(ctx);
        if(stallionConfig.getValue("darkMode"))
        {       
            ctx.fillStyle = "#ffffff"
            ctx.strokeStyle = "#ffffff"
        }
        return {ctx};

    }

    handleShowTextAction(ctx, current){
        // this.reportPathAction(ctx);
        if(stallionConfig.getValue("darkMode"))
            current.fillColor = "#ffffff"
        return {ctx,current};

    }

    handleTextAction(ctx, fontData, scaledX, scaledY){
        this.reportTextAction(ctx, fontData, scaledX, scaledY);
        if(stallionConfig.getValue("darkMode"))
            ctx.fillStyle = "#ffffff"
        return {ctx};

    }


    reportTextAction(ctx, fontData, scaledX, scaledY){
        var font = this.helper.fontNormalizer(fontData);
        var {x,y,w,h} = PageCoordinateTranslation.ctxToCanvas(ctx, scaledX, scaledY, font.fontSize, font.fontSize);
        // GUY TODO: !!!!!!!!!!!!!!!!! FIX ONCE YOU UNDERSTAND WHAT'S GOING ON!!!!!!!!!
        var newFontCtx = this.helper._generateFontContext(x, y, w, h, font);

        if(!this.debugMode){
            var curTextBlock = this.helper._last(this._textBlocks);
            

            /**** Identify text blocks ****/ 

            if(this.helper.isLineBreak(newFontCtx, this._curFontCtx)){
                if(!this.isTextBlockShared(newFontCtx, curTextBlock, this._curFontCtx)){
                    
                    this._textBlocks.push({ left: x, top: y,
                                            right: x+w,
                                            bottom: y+h,
                                            fonts: []});
                    curTextBlock = this.helper._last(this._textBlocks);
                }             
            }

            // Push character's font to block
            if(!this.helper.isDictInArray(newFontCtx.font, curTextBlock.fonts))
                curTextBlock.fonts.push(newFontCtx.font);

            // Update
            var {x: left , y: top, bottom, right} = newFontCtx;
            curTextBlock.right = Math.max(right, curTextBlock.right);
            curTextBlock.bottom = Math.max(bottom, curTextBlock.bottom);
            curTextBlock.left = Math.min(left, curTextBlock.left);
            curTextBlock.top = Math.min(top, curTextBlock.top);
        }
        /**** Handle different fonts ****/
        var currentFontRange = [];

        if((font.name.indexOf('Med') != -1)||
            (font.name.indexOf('Bold') != -1)){    
            currentFontRange.push("bold")
            this.helper.addToRangeTracker(this._fontRanges, currentFontRange, 
                PageCoordinateTranslation.canvasToDiv(ctx.canvas, x,y,w,h))               
        }
        


        if((font.name.indexOf('+CM') != -1)){                       // GUY TODO: Fix to regexp
            // Paint equations in debug mode
            if(this.debugMode){
                this.helper.addRect(ctx, 'rgb(0,225,0,0.2)', x, y, w, h)  
                                    //Guy TODO: though works marvelously, 10 is just a heuristic. FIX 
            }
        }


        this._curFontCtx = newFontCtx;
        this.idx++;
    }

    reportImageAction(ctx,x, y, w, h, type){
        if(w >= this._maxImgDim || w>= this._maxImgDim){
            return;
        }
        var rect = [x,y,w,h];
        this._images.push({'ctx':ctx, 'rect': rect, 'type': type})
    }


    finishedRenderingContext(curCtx,viewport, transform){
        // curCtx.style.backgroundColor = "#000000"
        if(!this.debugMode)
        return;
        
        var ctx = curCtx.getContext('2d');
        this._textBlocks.forEach(block =>{
            var {left,top, right, bottom} = block;
            this.helper.addRect(ctx, 'rgb(0,0,225,0.2)', left, top, right-left, bottom-top, null);
        });
        
        this._images.forEach((img) =>{
            var rect = img['rect'];
            this.helper.addRect(ctx, 'rgb(225,0,0,0.2)',rect[0], rect[1], rect[2], rect[3]);
            console.log(rect);
        });


        // this._fontRangePromise.resolve(this._fontRanges);

    }




    analyzeTextLayer(textLayer, pageView){
        
        
        if(!stallionConfig.getValue("autoInternalLink"))
        return;

        var queries = {'section':       [/((s|S)ec(tion|\.)) (\d+(\.\d+)*)/g, 4],
                       'definition':    [/((d|D)ef(inition|\.)) (\d+(\.\d+)*)/g, 4],
                       'algorithm':     [/((a|A)lg)(orithm|(\.)) (\d+(\.\d+)*)/g, 5],        
                       'figure':        [/((f|F)ig)(ure|(\.)) (\d+(\.\d+)*)/g, 5],        
                       'table':         [/((t|T)able) (\d+(\.\d+)*)/g, 3],        
                       'lemma':         [/((l|L)emma) (\d+(\.\d+)*)/g, 3],        
                       'proposition':   [/((p|P)roposition) (\d+(\.\d+)*)/g, 3],
                       'corollary':     [/((c|C)orollary) (\d+(\.\d+)*)/g, 3],        
                       'theorem':       [/(((t|T)heorem)|((T|t)hm)(\.)) (\d+(\.\d+)*)/g, 7]
                      };
        
        var pageIdx = pageView.id - 1;
        var findController = textLayer.findController;
        findController._extractText();
        findController._extractTextPromises[pageIdx].then(()=>{
            var docHeuristics = this.doc_heuristics;
            var pageContent = findController._pageContents[pageIdx];
            
            for(let qType in queries)
            {
                    var query = queries[qType][0];
                    var qName = queries[qType][1];
                    var posWithName = this._getPhrasePositions(pageContent, textLayer, query, qName);
                    for(var jj=0; jj<posWithName.length;jj++){
                        this._autoInternalLinks.push(posWithName[jj]);
                        this._appendAutoInternalLinkDiv(this._autoInternalLinks[jj], query, qName, textLayer, findController);            
                    }
            }     

            
    });                
    }

    _appendAutoInternalLinkDiv(link, query, qName, textLayer, findController){
        var qNameValue = link[1];
        var {top, left, width, height} = link[0][0];
        var link_div = document.createElement("div");

        // link_div.classList.add(qNameValue);
        link_div.style.top = top + "px";
        link_div.style.left = left + "px";
        link_div.style.height = height + "px";
        link_div.style.width = width + "px";
        link_div.style.position = "absolute";
        // var link_id = "stallion_link_" + link_name;
        link_div.style.cursor = 'pointer'
        link_div.onclick = () => {
            this.doc_heuristics.findMatchInFontRange(query, qName, qNameValue, ["bold"], textLayer, findController)
        }
        link_div.style.backgroundColor = 'rgb(0,0,255,0.4)'
        this.getPageDiv().appendChild(link_div);

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

    getPageDiv(){
        return document.querySelector(".page[data-page-number='"+(1+this.pageIdx)+"']")
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



}





export {PageHeuristics}
