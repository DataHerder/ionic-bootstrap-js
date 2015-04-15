/**
 * Ionic Bootstrap Base Class
 *
 * Further development for different ionic apps extend from this class
 *
 * By Paul Carlton http://www.paulcarlton.com
 *
 * MIT Licensed
 */

var IonicBootstrap = Class.extend({
	_bootstrap_type: '',
	require_list: [],
	list_of_modules: [],
	init: function(app_name, app_dependencies, type) {

		// keep namespace obscure
		if (String.prototype.__ionic_capitalize__ == undefined) {
			String.prototype.__ionic_capitalize__ = function () {
				return this.replace(/(?:^|\s)\S/g, function (a) {
					return a.toUpperCase();
				});
			};
		}

		this._bootstrap_type = type;
		this.app_name = app_name;
		this._app_dependencies = app_dependencies || [];
	},

	_loadAngularModules: function()
	{
		// assign the global variable App to the angular application
		// name the objects after
		if (this.__debug_log) {
			this.println('Loading App variables');
		}
		var dependencies = [
			'ionic',
			this.app_name + '.controllers',
			this.app_name + '.services'
		];
		for (var i = 0; i < this._app_dependencies.length; i++) {
			dependencies.push(this._app_dependencies[i]);
		}
		window.App = angular.module(this.app_name, dependencies);
		window.Controllers = angular.module(this.app_name + '.controllers', []);
		window.Services = angular.module(this.app_name + '.services', []);
	},

	run: function(func) {

		if (this.__debug_log) {
			this.println('Running App');
		}
		var cb = func || false;
		if (this.__isFunc(cb)) {
			window.App.run(func);
		} else {
			window.App.run(function($ionicPlatform) {
				$ionicPlatform.ready(function() {
					// Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
					// for form inputs)
					if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
						cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
					}
					if (window.StatusBar) {
						// org.apache.cordova.statusbar required
						StatusBar.styleLightContent();
					}
				});
			})
		}
		return this;
	},

	loaders: function(loaders)
	{
		this.__loaders = loaders || [];
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

	_run: function()
	{

	},

	println: function(str_or_object)
	{
		console.log('<[ IONICBOOTSTRAP : ' + str_or_object + ' ]>');
	},

	__debug_log: false,
	debug: function(bool)
	{
		this.log(bool);
		return this;
	},
	log: function(bool)
	{
		var b = bool || false;
		this.__debug_log = !!b;
	},

	__isFunc: function(func)
	{
		return func && {}.toString.call(func) === '[object Function]';
	}
});