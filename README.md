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

Add the following Javascript after requirejs and ionic-bootstrap scripts, it can be in the `<head>` or at the bottom of `<body>`

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

// ... later on down in app.js

App.filter('myfilter', function() { return function(input){ return input.toString().toUpperCase() } })
	.run(function($ionicPlatform) { ... })
	.config(function($stateProvider, $urlRooterProvider) { ... })
;
```

I recommend doing this.  In your controller files specify 
```javascript
Controllers.controller('MyControllerCtrl', function($scope) {
	// some controller code
});
``` 

And same with services.  I think it helps.  In your app.js, eventually you take all the controllers and services out and add them as separate files.

###States

In your app.js file, you'll see that Ionic sets the states within the .config method.  IonicBootstrap will rewrite the states so you can simply delete them all except the abstract.  If you erase the abstract state, it will break.

```javascript
.config(function($stateProvider, $urlRouterProvider) {
	// Ionic uses AngularUI Router which uses the concept of states
	// Learn more here: https://github.com/angular-ui/ui-router
	// Set up the various states which the app can be in.
	// Each state's controller can be found in controllers.js
	$stateProvider

		// setup an abstract state for the tabs directive
		.state('tab', {
			url: "/tab",
			abstract: true,
			templateUrl: "templates/tabs.html"
		})

		// Each tab has its own nav history stack:

		/*.state('tab.TabDashCtrl', {
			url: '/tab-dash',
			views: {
				'tab-dash': {
					templateUrl: 'templates/tab-dash.html',
					controller: 'TabDashCtrl'
				}
			}
		})*/

		/*.state('tab.chats', {
			url: '/chats',
			views: {
				'tab-chats': {
					templateUrl: 'templates/tab-chats.html',
					controller: 'ChatsCtrl'
				}
			}
		})
		.state('tab.chat-detail', {
			url: '/chats/:chatId',
			views: {
				'tab-chats': {
					templateUrl: 'templates/chat-detail.html',
					controller: 'ChatDetailCtrl'
				}
			}
		})

		.state('tab.account', {
			url: '/account',
			views: {
				'tab-account': {
					templateUrl: 'templates/tab-account.html',
					controller: 'AccountCtrl'
				}
			}
		})

		.state('tab.FlashCardsCtrl', {
			name: "tab.FlashCardsCtrl",
			url: "/flashcards/flash-cards",
			views: {
				flashcards: {
					controller: "FlashcardsCtrl",
					templateUrl: "templates/flashcards/flash-cards.html"
				}
			}
		})*/
	;
});
```

The states can be problematic if you don't change everything needed.  When defining a new state within Ionic, you need to remember to change the ionic tab in tabs.html or it won't work.

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
		// here I'm adding a new state history stack! 
		// add in tabs.html a new tab with the ion-nav-view name="tab-hello-world"
		// add in tabs.html the href of the new tab as "#/tab/tab-hello-world"
		'tab-hello-world': {
			// add in js/controllers/HelloWorldCtrl.js
			// add in templates/hello-world.js
			'': ['hello-world']
		}
	}
};
```

This will help you quickly add new controllers, it will also quickly allow you to change state names, rename -> refactor -> etc...
