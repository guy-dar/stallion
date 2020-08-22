import {PDFDataWriter} from "./pdf_data_writer.js"
import { StallionConfig } from "../config/utils.js";
import { Ref, Dict, Name } from "../../src/core/primitives.js";


class StallionPDFEditor{


    static generateComment(pdfDocument, pdfPage, contents, rect){
 
        if(!StallionConfig.getValue("allowEditing")){
            return;
        }

          var pageDict = pdfPage.pageDict;
          var trailer = pdfPage.xref.trailer;
          var startXRef = pdfDocument.startXRef;
          var pageRef = pdfPage.ref;
          
          var newPageDict = new Dict();
          for (var k in pageDict._map) {
            if( k != "Annots")
               newPageDict.set(k, pageDict.getRaw(k));
          }
          var annots = pageDict.getRaw("Annots") || [];
          var myComment = new Dict();
          myComment.set('Type', new Name('Annotation'));
          myComment.set('Subtype', new Name('Text'));
          myComment.set('Rect', rect);
          myComment.set('Contents', contents);
          var commentRef = new Ref(trailer.getRaw("Size"), 0); // GUY TODO: Check must be incremental + check no off by 1
          
          annots.push(commentRef);
          newPageDict.set('Annots', annots);

          var extraData = new PDFDataWriter(null, pdfDocument.stream.bytes.length) // GUY TODO: Check this really stands for `pdfData.byteLength`
            .setTrailer(trailer)
            .setStartXRef(startXRef)
            .startObj(commentRef)
            .appendDict(myComment)
            .endObj()
            .startObj(pageRef)
            .appendDict(newPageDict)
            .endObj()
            .appendTrailer()
            .toUint8Array();



            var blob = new Blob([stream.bytes, extraData], {
            type: 'application/pdf'
          });
          return {
            blob, 
            pdfBlobUrl: URL.createObjectURL(blob),
          };
        
    }



}


export {StallionPDFEditor}