import {StallionPDFEditor} from "../writer/editor.js"
class StallionExperiments{
    static guyAnnotations(page){
        console.log(page)
        var {blob} = (StallionPDFEditor.generateComment(page.pdfManager.pdfDocument, page,
             "a", [1,1,1,1]));
        var f = new FileReader();
        f.onload = function(e) {
        console.log(e.target.result);
        };

        f.readAsText(blob)
    }

}


export {StallionExperiments}