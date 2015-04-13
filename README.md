# ionic-bootstrap-js
Bootstrap Ionic with Require.js
Beta v0.1

## Automation

Automates states to controllers to templates and helps modularize your code.

This currently automates tabbed ionic projects

Example:

```javascript
var bootstrap = {
  states: {
    // under the history stack 'tab.main-screens'
    // loads /js/controllers/MainScreen1Ctrl.js
    // instantiates the state object for MainScreen1
    'main-screens': {
      'main': ['main-screen-1']
    },
    'search': {
      // search with search_id parameter in url, map to search_template.html
      'search': ['search/:search_id::search_template']
    }
  }
  loaders: [
    {
      // load your services and directives
      services: 'services.js',
      directives: 'directives.js'
  ]
};

IonicBootstrap.init(bootstrap, {log_states: true}, function(angular_app_instantiation_function) {
  require(['some/more/stuff.js'], function() {
    angular_app_instantiation_function();
  });
});
```
