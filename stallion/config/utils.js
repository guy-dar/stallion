import  { getConfig } from "./myconfig.js"

class StallionConfig{

    static init(){
        if(StallionConfig.isInit)
            return;
        StallionConfig.json = getConfig();       
        StallionConfig.isInit = true;
    }

    static getValue(key){
        StallionConfig.init();
        return StallionConfig.json[key];
    }

    static isValue(key, value){
        StallionConfig.init();
        return this.getValue(key) == value;
    }

    static get userConfigurable(){
        return {"darkMode":'bool'};
    }

    static setValue(key, value){
        StallionConfig.init();
        StallionConfig.json[key] = value;
    }

}



class StallionMemory{

    static init(useStorage = false){
        if(StallionMemory.isInit)
            return;
        StallionMemory.sessionData = {"pageData": {}};
        if(useStorage && chrome){
            StallionMemory.local = chrome.storage.local;
            StallionMemory.sync = chrome.storage.sync;
        }
        StallionMemory.isInit = true;
    }

    
    static data(dataItem){
        StallionMemory.init();
        if(StallionMemory.sessionData[dataItem])
            return StallionMemory.sessionData[dataItem];
        else if(StallionMemory.local && StallionMemory.local.get(dataItem) != undefined)
        {
            return notImplemented;
            StallionMemory.sessionData[dataItem] = JSON.parse(JSON.stringify(StallionMemory.local.get(dataItem)));
        }else if(StallionMemory.sync && StallionMemory.sync.get(dataItem) != undefined)
        {
            return notImplemented;
            StallionMemory.sessionData[dataItem] = JSON.parse(JSON.stringify(StallionMemory.sync.get(dataItem)));
        }    

        return StallionMemory.sessionData[dataItem];

    }

    static getPageDataArr(pageIdx, dataName){
        StallionMemory.init();
        if(!StallionMemory.data("pageData")[pageIdx])
            StallionMemory.data("pageData")[pageIdx] = {}
        if(!StallionMemory.data("pageData")[pageIdx][dataName])
            StallionMemory.data("pageData")[pageIdx][dataName] = []

        return StallionMemory.data("pageData")[pageIdx][dataName];
    }
    
    static addPageDataEntry(pageIdx, dataName, value){
        StallionMemory.init();
        var data = this.getPageDataArr(pageIdx, dataName);
        data.push(value);
    }

    static saveToStorage(value, justLocal = true){
        StallionMemory.init();
        return notImplemented;
        if(justLocal)
            var storage = StallionMemory.local;
        else
            var storage = StallionMemory.sync;

        storage.set(value, StallionMemory.data(value));
    }

}

export {StallionConfig, StallionMemory}