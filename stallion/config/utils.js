import  { getConfig } from "./myconfig.js"

class StallionConfig{

    constructor(){
        if(StallionConfig.isInit){
            return; 
        }
        StallionConfig.init();

    }

    static init(){
        StallionConfig.json = getConfig();       
        StallionConfig.isInit = true;
    }

    getValue(key){
        return StallionConfig.json[key];
    }

    isValue(key, value){
        return this.getValue(key) == value;
    }


}



class StallionMemory{
    constructor(){
        if(StallionMemory.isInit){
            return; 
        }
        StallionMemory.init();
    }

    static init(useStorage = false){
        StallionMemory.sessionData = {"pageData": {}};
        if(useStorage && chrome){
            StallionMemory.local = chrome.storage.local;
            StallionMemory.sync = chrome.storage.sync;
        }
        StallionMemory.isInit = true;
    }

    
    static data(dataItem){
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

    getPageDataArr(pageIdx, dataName){
        if(!StallionMemory.data("pageData")[pageIdx])
            StallionMemory.data("pageData")[pageIdx] = {}
        if(!StallionMemory.data("pageData")[pageIdx][dataName])
            StallionMemory.data("pageData")[pageIdx][dataName] = []

        return StallionMemory.data("pageData")[pageIdx][dataName];
    }
    
    addPageDataEntry(pageIdx, dataName, value){
        var data = this.getPageDataArr(pageIdx, dataName);
        data.push(value);
    }

    static saveToStorage(value, justLocal = true){
        return notImplemented;
        if(justLocal)
            var storage = StallionMemory.local;
        else
            var storage = StallionMemory.sync;

        storage.set(value, StallionMemory.data(value));
    }

}

export {StallionConfig, StallionMemory}