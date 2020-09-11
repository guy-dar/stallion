import { StallionPageUtils } from "./page_utils";


 function stallionRegexpMatch(query, contents, qGroup){
        var matches = [];
        var matchLengths = [];
        var matchNames = [];

        for(let matchInfo of contents.matchAll(query)){
            var match = matchInfo.index;
            matches.push(match);
            matchLengths.push(matchInfo[0].length);
            matchNames.push(matchInfo[qGroup])
        }
        return {matches, matchLengths, matchNames}
}



class StallionPageCoordinateTranslation{
    static ctxToCanvas(ctx, scaledX, scaledY, scaledW, scaledH){
        var {e: x, f: y, a: scaleA, d: scaleB} = ctx.getTransform(); //GUY TODO: As a matter of fact, a is only x's scale.
        var h =  scaledH * scaleB;   // GUY TODO: Should it be scaled?
        var w = scaledW * scaleA;                       // GUY TODO: that's dumb. But cannot get char width. is it because the char is square?
        y -= h;
        x += scaledX*scaleA;
        y += scaledY*scaleB;

        return {x,y,w,h}
    }


    static canvasToDiv(canvas, x, y, w, h){
        var wRatio = canvas.offsetWidth / canvas.width;
        var hRatio = canvas.offsetHeight / canvas.height;
        // GUY TODO: Fix ADD round here too
        return {x: x * wRatio, y: y * hRatio, w: w * wRatio, h: h * hRatio}
    }

    static divToCanvas(canvas, x, y, w, h, zoomBy = 1){
        var wRatio = canvas.offsetWidth / canvas.width;
        var hRatio = canvas.offsetHeight / canvas.height;
        wRatio /= zoomBy;
        hRatio /= zoomBy;

        return {x: Math.round(x / wRatio), y: Math.round(y / hRatio),
             w: Math.round(w / wRatio), h: Math.round(h / hRatio)}
    }


    static divToPdf(viewer, x, y, w, h, pageIdx = 0){
        var canvas = StallionPageUtils.getPageCanvas(pageIdx);
        
        var {top, left} = canvas.getBoundingClientRect();
        x -= left;
        y -= top;
        var [x1, y1] = viewer.getPageView(pageIdx).viewport.convertToPdfPoint(x,y);
        var [x2, y2] = viewer.getPageView(pageIdx).viewport.convertToPdfPoint(x + w, y + h);
        return {x: x1, y: y1, w: x2-x1, h: y2-y1}
    }    

}





export {stallionRegexpMatch, StallionPageCoordinateTranslation};