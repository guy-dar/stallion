class StallionReportHandler{
    static features = {};
    static init(){
        if(StallionReportHandler.isInit)
            return;
        StallionReportHandler.isInit = true;
    }
    


    static addFeature(featureName, func){
        StallionReportHandler.init();
        StallionReportHandler.features[featureName] = func;
    }

    static report(featureName, value){
        StallionReportHandler.init();
        StallionReportHandler.features[featureName](value);
    }


}


export {StallionReportHandler}