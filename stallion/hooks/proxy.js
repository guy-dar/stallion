class StallionDocumentHandler{
    static init(){
        if(StallionDocumentHandler.isInit)
            return;
        StallionDocumentHandler.features = {};
        StallionDocumentHandler.addFeature("features.links.bindlink", l=>{console.log(l.link.href)});
    
        StallionDocumentHandler.isInit = true;
    }
    


    static addFeature(featureName, func){
        StallionDocumentHandler.features[featureName] = func;
    }

    static report(featureName, value){
        StallionDocumentHandler.init();
        StallionDocumentHandler.features[featureName](value);
    }


}


export {StallionDocumentHandler}