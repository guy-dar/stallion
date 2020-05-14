import {PageHeuristics} from "../heuristics/page.js"
import {DocumentHeuristics} from "../heuristics/document_heuristics.js"
import { StallionConfig } from "../config/utils.js";


class StallionPageHandler{

    constructor(doc, pageIdx){
        this.heuristics = new PageHeuristics(doc, pageIdx);
    }

    static defaultSettings(ctx){
        var fillStyle = null, strokeStyle = null;
        if(StallionConfig.getValue("darkMode")){
            fillStyle = "#ffffff"
            strokeStyle = "#ffffff"
        }
        return {ctx: ctx, strokeStyle, fillStyle};
    }
    
    // Handlers
    
    handlePathAction(ctx){
        if(StallionConfig.getValue("darkMode"))
        {       
            ctx.fillStyle = "#ffffff"
            ctx.strokeStyle = "#ffffff"
        }
        return {ctx};

    }

    handleShowTextAction(ctx, current){
        if(StallionConfig.getValue("darkMode"))
            current.fillColor = "#ffffff"
        return {ctx,current};
    }

    handleTextAction(ctx, fontData, scaledX, scaledY){
        this.reportTextAction(ctx, fontData, scaledX, scaledY);
        if(StallionConfig.getValue("darkMode"))
            ctx.fillStyle = "#ffffff"
        return {ctx};

    }

    handleStrokeAction(ctx, strokeColor){
        if(StallionConfig.getValue("darkMode")){
            ctx.fillStyle = "#ffffff"
            strokeColor = "#ffffff"
        }
        return {ctx, strokeColor};
    }

    // Reports

    startRendering(){
        return this.heuristics.startRendering();
    }

    finishedRenderingContext(curCtx,viewport, transform){
        return this.heuristics.finishedRenderingContext(curCtx,viewport, transform)
    }
    
    analyzeTextLayer(textLayer, pageView){
        return this.heuristics.analyzeTextLayer(textLayer, pageView)
    }

    reportImageAction(ctx,x, y, w, h, type){
        return this.heuristics.reportImageAction(ctx,x, y, w, h, type);
    }

    reportTextAction(ctx, fontData, scaledX, scaledY){
        return this.heuristics.reportTextAction(ctx, fontData, scaledX, scaledY);
    }

}


class StallionDocumentHandler{
    constructor(){
        this.docHeuristics = new DocumentHeuristics(); 
    }

    
    
}


export {StallionDocumentHandler, StallionPageHandler}