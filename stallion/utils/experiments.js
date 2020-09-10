import {StallionPDFEditor} from "../writer/editor.js"
class StallionExperiments{
    static guyAnnotations(page){
        return;
        console.log(page)
        var {pdfBlobUrl} = (StallionPDFEditor.generateComment(page.pdfManager.pdfDocument, page,
             "a", [200,200,100,100]));
            console.log(pdfBlobUrl)
             // var f = new FileReader();
        // f.onload = function(e) {
        // console.log(e.target.result);
        // };

        // f.readAsText(blob)
    }

}


export {StallionExperiments}