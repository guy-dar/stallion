---
title: For Developers
template: layout.jade
---

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

## Simple Setup 
You can skip the [Getting the Code](#getting-the-code) section below and experiment with Stallion with Gitpod (an easy to use online IDE), where we made everything is available right out of the box. 
[![Open in Gitpod](https://gitpod.io/button/open-in-gitpod.svg)](https://www.gitpod.io/#https://github.com/guyd1995/Stallion)


## PDF.js
[PDF.js](https://mozilla.github.io/pdf.js/) is a Portable Document Format (PDF) viewer that is built with HTML5.

PDF.js is community-driven and supported by Mozilla Labs. Their goal is to
create a general-purpose, web standards-based platform for parsing and
rendering PDFs.

Please, visit their [repository](https://github.com/mozilla/pdf.js) for additional information.
 

## Contributing

We base our contribution guidelines on those of PDF.js. Also, we utilize their code base. All in all, you are very much encouraged to contribute to PDF.js. We advise you to take a glance at their code contribution guide(see below).

* [Issue Reporting Guide](https://github.com/guyd1995/Stallion/blob/master/.github/CONTRIBUTING.md)
* [Future Work](https://github.com/guyd1995/Stallion/wiki/Future_Work)

* PDF.js
	+ [PDF.js Code Contribution Guide](https://github.com/mozilla/pdf.js/wiki/Contributing)
	+ [Frequently Asked Questions](https://github.com/mozilla/pdf.js/wiki/Frequently-Asked-Questions)
	+ [Good Beginner Bugs](https://github.com/mozilla/pdf.js/issues?direction=desc&labels=5-good-beginner-bug&page=1&sort=created&state=open)
