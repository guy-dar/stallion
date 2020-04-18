---
title: Users
template: layout.jade
---
## Features
In addition to all the amazing features in PDF.js, here are some more.

### The Slash Bar
With simplicity as a core principle in Stallion, we introduce the (*soon to be famous*) **Slash Bar** (triggered by pressing `/` anywhere in the document). 
The slash bar allows you to type commands instead of using on-screen buttons. 

![Slash Bar](docs/contents/images/zoom_slash_bar.gif)

#### Basic

* `outline` - Toggle document's outline (if exists).
* `toolbar` - Toggle PDF.js-derived toolbar (hidden by default).

* `back` - Go back.
* `page`*`number`* - Go to page.
* `zoom in/out [`*`digit`*`]` - Zoom. *digit* is optional. If specified, determines iterates the operation *digit* times.

#### Navigation
* `shortcut/name/dub`*`name`* - Set shortcut to current location in document.
* `jump`*`name`* - Go to shortcut.  
* `fgoto`*`SearchPhrase`* - Find next occurence of the search phrase. You are advised to use the find bar instead (`Ctrl+F`).
*  `fpeek`*`SearchPhrase`* - Opens a Peek Box for the search phrase.


Note: Typing wrong commands can get offensive.

### Peek Box
The Peek Box is used as a substitute for the standard find operation. 
It allows you to peek at different locations without leaving the current.
Ideally, it should allow you to review definitions, references, theorems, and other parts of the document without the burden of context switching.

![Peek Box](docs/contents/images/peek_box.gif)


### Double Slash: experimental
Select text and double-click `/`. This will invoke a double slash operation. It serves several purposes

#### 1. Peek at selection
In its most naive use, it will just `fpeek` the selected text. 
If the selection follows certain patterns, it is supposed to present some more advanced behavior (*intelligent peeking*) which is still under active development.

#### 2. Reference Resolution (preliminary)
If the reference trigger is fired (As of now, this happens if the selection has more than 20 characters), a reference summary box will appear. This summary includes: Title, URL, reference count and citation count. As of now, the resolution is still handled poorly. Plus, even if the right article is found,  data isn't always correct.

#### 3. Quick fpeek 
If no text is selected, the slash bar is opened, waiting for a keyword for `fpeek`.
