
/**
 * Ionic Bootstrap Tabs Class
 *
 * Helps modularize code for larger hybrid
 * projects that have tab states baked in.
 *
 * By Paul Carlton http://www.paulcarlton.com
 *
 * MIT Licensed
 */


var IonicBootstrapTabs = IonicBootstrap.extend({
	root_index: '/tab/dash',
	init: function(app_name, app_dependencies) {
		if (app_name == undefined || typeof(app_name) != 'string' || app_name == '') {
			throw new Error('Invalid name for your ionic application.  ' +
			'When instantiating IonicBootstrapTabs, please pass an app name as a string value.  ' +
			'Ie: "var Iot = new IonicBootstrapTabs("myApp")');
		}
		this._super(app_name, app_dependencies, 'IonicTabs');
		this._loadAngularModules();
	},

	config: function(func)
	{
		var cb = func || false;
		if (this.__isFunc(cb)) {
			window.App.config(func);
		} else {
			window.App.config(function($stateProvider) {
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
			});
		}
		return this;
	},


	states: function(state_object)
	{
		this.__states = state_object || {};
		return this;
	},

	bootstrap: function(callback)
	{
		var cb = callback || false;
		this._parseStates();
		this._runList(this.__loaders, 'js', this);
		this._runList(this.list_of_modules, 'js', this);
		this._run(cb);
	},

	_run: function(cb)
	{
		var self = this;

		this._runList(this.list_of_modules, 'js', self);
		require(this.require_list, function() {
			window.App.config(function($stateProvider, $urlRouterProvider) {
				for (var i = 0; i < self.state_objects.length; i++) {
					var obj = self.state_objects[i];
					if (self.__debug_log === true) {
						console.log(obj);
					}
					$stateProvider.state(obj['name'], obj['params']);
				}
				if (self.__debug_log === false) {
					$urlRouterProvider.otherwise(self.root_index);
				}
			});
			if (cb) {
				cb(function(){
					angular.bootstrap(document.getElementById(self.app_name), [self.app_name])
				});
			} else {
				angular.bootstrap(document.getElementById(self.app_name), [self.app_name])
			}
		});
	},

	state_objects: [],

	/**
	 * Create the state objects from the passed states
	 *
	 * @private
	 */
	_parseStates: function() {
		for (var root_state in this.__states) {
			if (this.__states.hasOwnProperty(root_state)) {
				for (var dir in this.__states[root_state]) {
					if (this.__states[root_state].hasOwnProperty(dir)) {
						for (var i = 0; i < this.__states[root_state][dir].length; i++) {
							// the raw state, this is the template and controller name
							// derive the state name (which could be anything) and
							// scrube the controller name out of the html template
							var _state_ = this.__states[root_state][dir][i],
								url = '',
								template_name = '',
								controller_name = '',
								state_name = '',
								resolve = false
								;
							if (this._getType(_state_) === 'string') {
								url = _state_;
								template_name = url.replace(/(\/?\:.*)/, '').replace(/\/$/, '');
								controller_name = template_name.replace(/-/g, ' ')
									.__ionic_capitalize__()
									.replace(/\s/g, '') + 'Ctrl';
								// state object specific information
								// states must have tab appended to it, state name
								// will continue in as the controller name with a tab
								state_name = 'tab.' + controller_name;
							} else if (this._getType(_state_) === 'object') {
								url = _state_.url;
								template_name = _state_.template;
								controller_name = _state_.controller;
								state_name = 'tab.' + controller_name;
								if (_state_.resolve != undefined) {
									resolve = _state_.resolve;
								}
							} else {
								throw new Error('Unsupported state type: ' + this._getType(_state_));
							}

							// override the template if it is found
							var template_replaced = false;
							if (/::/.test(this.__states[root_state][dir][i])) {
								var tmp = this.__states[root_state][dir][i].split('::');
								url = tmp[0];
								template_replaced = true;
								template_name = tmp[1];
							}

							var temp_state = {
								'name': state_name,
								params: {
									// add the directory in at the last stage
									'url': ('/' + dir + '/' + url).replace(/\/{2,}/, '/'),
									views: {}
								}
							};
							temp_state['params']['views'][root_state] = {
								// the template checks to see if the root directory is being overridden simply by checking for the /
								templateUrl: ('templates/' + (template_replaced && /\//.test(template_name) ? '' : dir + '/') + template_name + '.html').replace(/\/{2,}/, '/'),
								controller: controller_name
							};
							if (resolve) {
								temp_state['params']['resolve'] = resolve;
							}
							this.state_objects.push(temp_state);

							// push the module to load in require
							if (this.list_of_modules[0] == undefined) {
								this.list_of_modules[0] = {
									'controllers': []
								};
							}
							this.list_of_modules[0].controllers.push(
								dir + '/' + controller_name + '.js'
							)
						}
					}
				}
			}
		}
	}

});