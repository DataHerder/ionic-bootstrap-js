# ionic-bootstrap-js
Bootstrap Ionic with Require.js
Beta v0.1

## Automation

Automates states to controllers to templates and helps modularize your code.

This is currently beta!

##Step by step

###Step 1
`npm install ionic -g`

###Step 2
`ionic start new_ionic tabs`

###Step 3
In your index.html
Replace: `<body ng-app="starter">` with `<body id="[your_app_name]">`

###Step 4
Clone ionic-bootstrap.js into a directory of your choice within the js/ folder, preferrably js/vendors

###Step 5
Add <a href="http://requirejs.org/">RequireJS</a> to your js/ subfolder

###Step 6
In index.html, add requirejs and ionic-bootstrap scripts underneath the application scripts.

Step 5 & 6 should look something like this:
```
	<script src="js/vendors/require.js"></script>
	<script src="js/vendors/ionic-bootstrap.js"></script>
```

###Step 7

Add the following Javascript

```javascript
var bootstrap = {
	states: {
		// 'tab-dash' is the history stack! Every new template and controller added
		// will be apart of that history stack for ionic
		'tab-dash': {
		  // 'folder': 'state->template->controller'
			'': ['tab-dash']
		},
		'tab-settings': {
			'': ['tab-settings']
		},
		'tab-profile': {
			'': ['tab-profile']
		},
		'chat-detail': {
			'': ['chat-detail']
		},
	}
};

IonicBootstrap.root_index = '/tab/tab-dash';
IonicBootstrap.app_name = '[your_app_name]';
IonicBootstrap.init(bootstrap, {log_states: true}, function(angular_app_instantiation_function) {
  // you can optionally pass a callback function into ionic bootstrap to do some more stuff before
  // instantiating the application
  //require(['some/more/stuff.js'], function() {
    angular_app_instantiation_function();
  //});
});
```

###Step 8

Refresh with chrome developer tools enabled and check for loading errors on controllers, you should find them.  This is what helps you modularize your code, you'll notice that each controller is expected to be in it's own file named exactly as the controller in the same name as the template (you can change this behavior with some sugar, but I haven't documented that yet), for example: chat-detail => ChatDetailCtrl in js/controllers/ChatDetailCtrl.js.  Add the following files and keep them empty since the controllers are in controller.js.  Ionic puts them into one file, you can change that later if need be.

Then it should run once the controller files have been added.  You can see here that it forces modularization and organizing of your code.

If you like it contribute please! :-)

##Other things to consider
###Controllers, Services, Directives, oh my!

Angular allows you to assign to a variable the controllers, services and directives to a variable as such:

```javascript
var App = angular.module('starter', ['ionic', 'starter.controllers', 'starter.services']);
var Controllers = angular.module('starter.controllers', []);
var Services = angular.module('starter.services', []);
```

I recommend doing this.  In your controller files specify 
```javascript
Controller.controller('MyControllerCtrl', function($scope) {
	// some controller code
});
``` 

And same with services.  I think it helps.  In your app.js, eventually you take all the controllers and services out and add them as separate files.
