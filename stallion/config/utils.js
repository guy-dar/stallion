import myConfig, { getConfig } from "./myconfig.js"

class StallionConfig{

    constructor(){
        this.json = getConfig();       
    }


    getValue(key){
        return this.json[key];
    }

    isValue(key, value){
        return this.getValue(key) == value;
    }


}


export {StallionConfig}