# Stallion [![Build Status](https://travis-ci.com/guyd1995/Stallion.svg?branch=master)](https://travis-ci.org/guyd1995/Stallion) 
Stallion is an extended PDF viewer based on [PDF.js](https://mozilla.github.io/pdf.js/).  It provides researchers with tools that make paper reading simpler.

If you are experiencing trouble, please let us know.


You can play around with our [Demo](https://guyd1995.github.io/Stallion/web/viewer.html)!
You can also visit us on our website: [Homepage](https://guyd1995.github.io/Stallion)

Help us! [Contribute](#contributing)

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


### Double Slash
Select text and double-click `/`. This will invoke a double slash operation. Naively it will just `fpeek` the selected text. With specific keywords, it is supposed to present some more advanced behavior (*intelligent peeking*) yet to be developed.



## Getting the Code

To get a local copy of the current code, clone it using git:

    $ git clone https://github.com/guyd1995/Stallion.git
    $ cd Stallion

Next, install Node.js via the [official package](https://nodejs.org) or via
[nvm](https://github.com/creationix/nvm). You need to install the gulp package
globally (see also [gulp's getting started](https://github.com/gulpjs/gulp/blob/master/docs/getting-started.md#getting-started)):

    $ npm install -g gulp-cli

If everything worked out, install all dependencies for PDF.js:

    $ npm install

Finally, you need to start a local web server as some browsers do not allow opening
PDF files using a `file://` URL. Run:

    $ gulp server

and then you can open:

+ http://localhost:8888/web/viewer.html

Please keep in mind that this requires an ES6 compatible browser; refer to [Building PDF.js](https://github.com/mozilla/pdf.js/blob/master/README.md#building-pdfjs) for usage with older browsers.

It is also possible to view all test PDF files on the right side by opening:

+ http://localhost:8888/test/pdfs/?frame

## PDF.js
[PDF.js](https://mozilla.github.io/pdf.js/) is a Portable Document Format (PDF) viewer that is built with HTML5.

PDF.js is community-driven and supported by Mozilla Labs. Their goal is to
create a general-purpose, web standards-based platform for parsing and
rendering PDFs.

Please, visit their [repository](https://github.com/mozilla/pdf.js) for additional information.

## Future Goals
There's plenty to be improved:
* More features! Please! *Send us feature requests*.
* Better heuristics!
* Debugging (code was written in an ad-hoc manner, which might potentially result in bugs)
* Checking browser compatibility
* Design choices (Peek Box design most notably)
* Speed
* Moving to asynchronous routines
* Design for Mobile browsers
* Refactoring code. 
	* Separating from PDF.js for cleaner merges.
	* More documentation
	* Better practice code
* Vebosity in non-"happy flow" scenarios.
 

## Contributing

As for now, we keep the same contribution guidelines as PDF.js:

* [Issue Reporting Guide](https://github.com/mozilla/pdf.js/blob/master/.github/CONTRIBUTING.md)
* [Code Contribution Guide](https://github.com/mozilla/pdf.js/wiki/Contributing)
* [Frequently Asked Questions](https://github.com/mozilla/pdf.js/wiki/Frequently-Asked-Questions)
* [Good Beginner Bugs](https://github.com/mozilla/pdf.js/issues?direction=desc&labels=5-good-beginner-bug&page=1&sort=created&state=open)
* [Projects](https://github.com/mozilla/pdf.js/projects)

