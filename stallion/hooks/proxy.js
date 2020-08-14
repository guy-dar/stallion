class StallionDocumentHandler{
    static init(){
        if(StallionDocumentHandler.isInit)
            return;
        StallionDocumentHandler.features = {};
    
        StallionDocumentHandler.isInit = true;
    }
    


    static addFeature(featureName, func){
        StallionDocumentHandler.init();
        StallionDocumentHandler.features[featureName] = func;
    }

    static report(featureName, value){
        StallionDocumentHandler.init();
        StallionDocumentHandler.features[featureName](value);
    }


}


export {StallionDocumentHandler}