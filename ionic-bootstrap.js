/**
 * IonicBootstrap is an initialization object for Ionic Framework, automating
 * the loading of scripts and the controllers based on the folder application
 * as well as automating the view stack.  If you build a larger app, there's
 * more scripts to handle and more loading, or you could manage one large file
 * but modularizing that would be kind of a pain, so this uses require.js and
 * bootstraps the controllers and services together, then instantiates the
 * angular application
 *
 * -------------------------------------------------------------------------------
 * States:
 * The primary purpose I created this was to dynamically add views to controllers
 * to states without manually adding it.  If you have lots of pages, this starts
 * to become a headache when making changes or adding other screens.  I spent some
 * time trying to debug simple spelling mistakes or wrong name in one parameter
 * somewhere so this automates that for me and modularizes my code.  This assumes
 * using controllers not directives as controllers.
 *
 * Lets go by example
 * I have one screen and one page, I would load something like this as a state:
 *
 *	.state('tab.dash', {
 *		url: '/dash',
 *		views: {
 *			'tab-dash': {
 *				templateUrl: 'templates/tab-dash.html',
 *				controller: 'DashCtrl'
 *			}
 *		}
 *	})
 *
 * However if I had 20 of these and 10 different screens, it's cumbersome
 * to change if I wanted to rename something.  So to create this exact state
 * I would pass in the IonicBootstrap.init() function:
 *
 * {
 * 	states: {
 *		'tab-dash': ['dash::tab-dash.html'] // or
 *		//'tab-dash': 'dash::tab-dash.html'
 * 	}
 * }
 *
 * 'tab-dash' is of course the screen stack, so all pages
 * with 'tab-dash' will be stacked by history so if I wanted
 * 2 pages it would be:
 *
 * {
 * 	states: {
 *		'tab-dash': ['dash::tab-dash.html', 'dash2']
 * 	}
 * }
 *
 * 'dash' will become '/dash' as an url, it will expect
 * 'DashCtrl' as the controller and it will expect 'tab-dash.html' as the template.
 * However 'dash2' will expect 'Dash2Ctrl' as the controller and 'dash/dash.html' as the template
 *
 *
 * -------------------------------------------------------------------------------
 * Loading Other Scripts:
 * For directives, services, vendors, toolsets etc...
 *
 * ie:
 * {
 * 	// the states variable
 * 	states: {},
 * 	// all the other scripts to load
 * 	loaders: {
 * 		'directory1': 'js-script.js',
 * 		'directory2': {
 * 			'directory3': 'js-script2.js'
 * 		},
 * 		'directory4': {
 * 			'directory5': {
 * 				'directory6: ['js-script3.js', 'js-script4.js']
 * 			}
 * 		}
 * 	}
 * }
 *
 * @author Paul Carlton
 * @version 0.1 beta
 * @copyright 2015
 * @type {{
 * 		state_objects: Array,
 * 		list_of_modules: {
 * 			controllers: Array,
 * 			services: string[]
 * 		}[],
 * 		states: {},
 * 		require_list: Array,
 * 		init: Function,
 * 		_runList: Function,
 * 		_run: Function,
 * 		_parseStates: Function
 * 	}}
 */
var IonicBootstrap = {

	// this is an array of all state objects that will be loaded
	state_objects: [],

	// it's an array that loops, and we want to be able to control
	// whatever gets added by extending the list after state controller population
	list_of_modules: [{
		'controllers': []
		//'services': ['Search.js']
	}],

	// holds the states that have been assigned from the programmer
	states: {},

	// the list of required js dependencies to load
	require_list: [],

	// options that are passed through init: function()
	options: {},

	// the root index, used for which state to go back to if a view error occurs
	root_index: '/tab/tab-dash',

	// ionic app name and id used for the application
	app_name: 'starter',


	/**
	 * IonicBootstrap has one public function: init()
	 * This function starts the loading of scripts and states
	 *
	 * @param ionic_bootstrap_data
	 * @param options
	 * @param callback_function
	 */
	init: function(ionic_bootstrap_data, options, callback_function)
	{
		// keep namespace obscure
		String.prototype.__ionic_capitalize__ = function() {
			return this.replace(/(?:^|\s)\S/g, function(a) { return a.toUpperCase(); });
		};

		this.options = options || {};
		var cb = callback_function || false,
			state_instantiations = undefined
			;

		if (ionic_bootstrap_data.states == undefined) {
			throw new Error('State data is required');
		} else {
			state_instantiations = ionic_bootstrap_data.states;
		}


		if (typeof this.options === 'function') {
			cb = this.options;
			this.options = {};
		}

		if (0 === Object.keys(this.options).length) {
			this.options = {
				'log_states': false
			};
		} else {
			if (this.options['log_states'] == undefined) {
				this.options['log_states'] = false;
			}
		}

		/**
		 * This if condition loads all scripts not associated with Controller states
		 *
		 * IE Factories and Services
		 *
		 * Example of expected data structure:
		 * ionic_bootstrap_data.loaders = [{
		 * 		'services': 'Service-1.js',
		 * 		'factories': ['Factory-1.js','Factory-2.js']
		 * 		// for subdirectories: vendor/vendor-1/Vendor-script-1.js
		 * 		'vendor': {
		 * 			'vendor-1': 'Vendor-script-1.js'
		 * 		}
		 * 	}];
		 */
		if (ionic_bootstrap_data.loaders != undefined) {
			// should be an array
			if (Object.prototype.toString.call(ionic_bootstrap_data.loaders) !== '[object Array]' ) {
				throw new Error('Loaders must be array');
			} else {
				var tmp_object = angular.copy({});
				for (var j = 0; j < ionic_bootstrap_data.loaders.length; j++) {
					var tmp = ionic_bootstrap_data.loaders[j];
					if (this._getType(tmp) == 'object') {
						// just
						for (var k in tmp) {
							if (tmp.hasOwnProperty(k)) {
								tmp_object[k] = tmp[k]; // tmp[k] === array || string < should
							}
						}
					}
				}
				this.list_of_modules.push(tmp_object);
			}
		}

		this.states = state_instantiations || {};
		this._parseStates();
		this._run(cb);
	},

	/**
	 * Shorthand for object type
	 *
	 * @param object
	 * @returns {*}
	 * @private
	 */
	_getType: function(object) {
		if (Object.prototype.toString.call(object) === '[object Object]') {
			return 'object';
		} else if (Object.prototype.toString.call(object) === '[object Array]') {
			return 'array';
		} else if (Object.prototype.toString.call(object) === '[object String]') {
			return 'string';
		} else {
			return object;
		}
	},

	/**
	 * Prepare the require list
	 *
	 * @param list
	 * @param prepend_dir
	 * @param self
	 * @private
	 */
	_runList: function(list, prepend_dir, self) {
		// the controllers and services follow a naming convention for automatic loading
		// we know the list is an array,
		var prep = prepend_dir.replace(/\/+$/g, '') + '/' || '';
		var which_type = this._getType(list);
		if (which_type == 'object') {
			// the ternary needs to be debugged
			for (var j in list) {
				if (list.hasOwnProperty(j)) {
					self._runList(list[j],  ((prep == '' ) ? '' : prep) + j, self);
				}
			}
		} else if (which_type == 'array') {
			for (var i = 0; i < list.length; i++) {
				self._runList(list[i], prep, self);
			}
		} else if (which_type == 'string') {
			self.require_list.push((prep + list).replace(/\/{2,}/,'/'));
		}
	},

	/**
	 * Run the require and application configuration, then load the states
	 *
	 * @param cb
	 * @private
	 */
	_run: function(cb) {
		var self = this;

		this._runList(this.list_of_modules, 'js', self);
		require(this.require_list, function() {
			App.config(function($stateProvider, $urlRouterProvider) {
				for (var i = 0; i < self.state_objects.length; i++) {
					var obj = self.state_objects[i];
					if (self.options.log_states === true) {
						console.log(obj);
					}
					if (obj['name'] == 'tab.GeofenceCtrl') {
						obj['params'].resolve = {
							geofence: function ($stateParams, geofenceService, $q) {
								var geofence = geofenceService.findById($stateParams.geofenceId);
								if (geofence) {
									return $q.when(geofence);
								}
								return $q.reject('Cannot find geofence with id: ' + $stateParams.geofenceId);
							}
						};
					}
					$stateProvider.state(obj['name'], obj['params']);
				}
				$urlRouterProvider.otherwise(self.root_index);
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

	/**
	 * Create the state objects from the passed states
	 *
	 * @private
	 */
	_parseStates: function() {
		for (var root_state in this.states) {
			if (this.states.hasOwnProperty(root_state)) {
				for (var dir in this.states[root_state]) {
					if (this.states[root_state].hasOwnProperty(dir)) {
						for (var i = 0; i < this.states[root_state][dir].length; i++) {
							// the raw state, this is the template and controller name
							// derive the state name (which could be anything) and
							// scrube the controller name out of the html template
							var url = this.states[root_state][dir][i],
								template_name = url.replace(/(\/?\:.*)/, '').replace(/\/$/, ''),
								controller_name = template_name.replace(/-/g, ' ')
										.__ionic_capitalize__()
										.replace(/\s/g, '') + 'Ctrl',
							// state object specific information
							// states must have tab appended to it, state name
							// will continue in as the controller name with a tab
								state_name = 'tab.' + controller_name;

							// override the template if it is found
							var template_replaced = false;
							if (/::/.test(this.states[root_state][dir][i])) {
								var tmp = this.states[root_state][dir][i].split('::');
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
							this.state_objects.push(temp_state);

							// push the module to load in require
							this.list_of_modules[0].controllers.push(
								dir + '/' + controller_name + '.js'
							)
						}
					}
				}
			}
		}
	}
};
