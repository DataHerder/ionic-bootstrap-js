# ionic-bootstrap-js
Ionic Bootstrap with Require.js
Beta v0.2

##About
This is a light weight library that utilizes require to help modularize larger ionic projects.  This version currently supports ionic tab projects.  It handles the tab stack while enforcing 1 to 1 mapping between the controller, template and url.

You can map multiple controllers to the same template using the `::` separator.  This makes it handy to allow one template to handle different endpoints.  For instance, you may have an event template but where that template is accessed may differ depending on the stack.  For instance you may have a search tab and an event tab, but the search tab also displays an event.  This is where one template can be referenced in 2 different state stacks.  

Basically, each tab is a state stack.  Handling that in one large file, or even breaking it apart into files can be cumbersome after it gets big.  What if the client comes back with a change that requires a different structure?  What about maintenance or "version 2"?  Making adjustments, adding on, or changing the stack is now much easier and handled in one spot rather than changing multiple files.

Currently there is a working ionic tab application in the repo to help you get started.  You can use that as a reference.

Adding into an already existing application may take some time.  It will force files to exist (because of require) with your application controller logic.  Dropping it in with no states and to slowly add states using the variable is the best way to roll out the bootstrap in an existing project.  I highly recommend using Google Chrome Developer Tools.

###Step 1
`npm install ionic -g`

###Step 2
`ionic start new_project tabs`

###Step 3
Download and place in your js/vendors directory ionic-bootstrap.js and require.js

###Step 4
Use the working example as a guide to comment out the correct scripts and copy the state stack


##The Code

```javascript
/**
 * This creates a new instance and initializes the global 
 * app, controller, service variables.
 */
var Iot = new IonicBootstrapTabs('starter');

Iot.debug(true); // turn on for logging
Iot.config();    // execute the default ionic configuration
Iot.run();       // execute the default run code
Iot.states({})   // load states for parsing and autoloading by require
Iot.loaders([])  // other files from the js/lib or js/vendors to load

// bootstrap ionic project, executes the code
// that runs states, loads files etc...
Iot.bootstrap();
```

###controllers

Controller scripts go into js/controllers and you create them with the following variable `Controllers`:
```javascript
Controllers.controller('ControllerCtrl', function($scope) {
    // ... some code
});
```

###services

Services checked in /services directory and you create them with the following variable `Services`:
```Javascript
Services.service('Service', function() {
    this.get = function () {

    };
});
```

###Factories and directories
Factories can either fit in on file, stay with their respective service or in separate files.  Directories are also not inforced.
