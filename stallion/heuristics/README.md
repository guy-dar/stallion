== Heursitics ==
This is where we keep the *heuristics*, used by Stallion for decision making on different subjects.

The implementation of a heursitic might be gruesome and unpleasant. Of course, when possible, modularity and code sharing is still important. 

Heuristics are required for several purposes:

* **page.js** - Needed for infering information about the page. This includes (among others): the identification of theorems, definitions, etc.,  section breakdown, reference identification and so forth.

* **visual.js** - For decision making about visual details such as position and size of widgets and other objects. Might use `page.js`

* **document_heuristics.js** - Provides an interface between different page heuristics. It is needed for interaction between different page heuristics.


Heuristics is highly dependent on utilities and, one should refrain from including general utilities here. Instead, consider choosing `utils` for that. 


=== Future ===
* The code should be refactored. 
* It is likely that further actions: merge, split, addition and deletion of files would be needed.
* Better heuristics are required.
* Heuristics should not be re-rendered each time page is rendered. Further, they should live on document level, and be less page specific.
* Heuristics should *stream* and change online in the backgorund without hindering performance (rather than being decided during page rendering).
