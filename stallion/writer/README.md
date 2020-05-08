= Editing PDF Pages =

Here we keep the logic for editing PDF documents. 
The starting point of this code is PDF.js' Pull Request #6190 by **Rob--W**.

Code for adding persistent comments and other modifications to the document, as well as handling the saving of changes, would be found here.

Note, the functionalities present here are enabled
only if `"allowEditing"` is set to `true` in the user's configuration JSON.
