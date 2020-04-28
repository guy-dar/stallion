

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



class PageCoordinateTranslation{
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
        return {x: x * wRatio, y: y * hRatio, w: w * wRatio, h: h * hRatio}
    }



}





export {stallionRegexpMatch, PageCoordinateTranslation};