/* globals Promise, assert, isRef, Dict, Name, PDFDataWriter */

'use strict';

function getDataForPrintingImplementation(pdfManager) {
  pdfManager.requestLoadedStream();
  return pdfManager.pdfDocument.getData().then(function(pdfData) {
    var pdfDocument = pdfManager.pdfDocument;

    var catDict = pdfDocument.catalog.catDict;
    var trailer = pdfDocument.xref.trailer;
    var startXRef = pdfDocument.startXRef;
    var catalogRef = trailer.getRaw('Root');

    var newCatDict = new Dict();
    for (var k in catDict.map) {
      if (k !== 'OpenAction') {
        newCatDict.set(k, catDict.getRaw(k));
      }
    }
    var openActionDict = new Dict();
    openActionDict.set('Type', new Name('Action'));
    openActionDict.set('S', new Name('JavaScript'));
    openActionDict.set('JS', 'this.print();');
    newCatDict.set('OpenAction', openActionDict);

    return;
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