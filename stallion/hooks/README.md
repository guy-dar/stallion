## Hook handlers

*Hooks* are minimal interfaces to PDF.js made to grant Stallion's code access to the core functionalities of PDF.js. 
This provides Stallion with broad control over the entire PDF lifecycle, with negligible intervention within the original PDF.js it is based on. 

This folder contains different handlers which serve as proxy to internal Stallion functionalities:

* **render.js**: This file exposes the PDF rendering code to Stallion. It reports and handles canvas object creation events. Additionally, it might handle text layer events.

* **common.js**: General purpose code shared between handlers.