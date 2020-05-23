import {PDFDataWriter} from "./pdf_data_writer.js"
import { StallionConfig } from "../config/utils.js";


class StallionPDFEditor{


    static getPromise(pdfManager){
 
        if(!StallionConfig.getValue("allowEditing")){
            return;
        }

        var pdfDocument = pdfManager.pdfDocument;

        return pdfDocument.getData().then(pdfData =>  {
            var catDict = pdfDocument.catalog.catDict;
            var trailer = pdfDocument.xref.trailer;
            var startXRef = pdfDocument.startXRef;
            var catalogRef = trailer.getRaw('Root');
        
            var newCatDict = new Dict();
            for (var k in catDict.map) {
              if (true) {
                newCatDict.set(k, catDict.getRaw(k));
              }
            }
            var openActionDict = new Dict();
            openActionDict.set('Type', new Name('Annotation'));
            openActionDict.set('Subtype', new Name('Text'));
            openActionDict.set('JS', 'this.print();');
            newCatDict.set('OpenAction', openActionDict);
        
            var extraData = new PDFDataWriter(null, pdfData.byteLength)
              .setTrailer(trailer)
              .setStartXRef(startXRef)
              .startObj(catalogRef)
              .appendDict(newCatDict)
              .endObj()
              .appendTrailer()
              .toUint8Array();
            var blob = new Blob([pdfData, extraData], {
              type: 'application/pdf'
            });
            return {
              pdfBlobUrl: URL.createObjectURL(blob),
            };
          });
    }



}


export {StallionPDFEditor}