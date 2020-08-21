class StallionReportHandler{
    static init(){
        if(this.isInit)
            return;
        this.features = {};
    
        this.isInit = true;
    }
    


    static addFeature(featureName, func){
        this.init();
        console.log(this.features)

        this.features[featureName] = func;
    }

    static report(featureName, value){
        this.init();
        console.log(this.features)
        this.features[featureName](value);
    }


}


export {StallionReportHandler}