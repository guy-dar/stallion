import {PDFDataWriter} from "./pdf_data_writer.js"
import { StallionConfig } from "../config/utils.js";


class StallionPDFEditor{


    static getPromise(pdfManager){
 
        if(!StallionConfig.getValue("allowEditing")){
            return;
        }

        var pdfDocument = pdfManager.pdfDocument;

        return pdfDocument.getData().then(data =>{
            var myThis = new StallionPDFEditor();
            myThis.pdfManager = pdfManager;
            var originalData = data;
            myThis.initDataWriter(originalData);
            return myThis;
        });
    }



    initDataWriter(originalData){
        this.originalDataByteLength;
        return;
        this.pdfWriter = new PDFDataWriter(originalData);
        this.extraData = new PDFDataWriter(null, this.originalDataByteLength)       
    }






}


export {StallionPDFEditor}