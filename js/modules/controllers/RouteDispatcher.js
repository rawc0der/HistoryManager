define([
 'underscore', 
 'backbone'


], function(_, Backbone){
	/**
	 */
	var RouteDispatcher = function(routes, controller, options){
		
		this.eventCallOrder = [ 
			'pagebeforecreate',
			'pagecreate', 
			'pageinit', 
			'pagebeforeshow',
			'pageshow',
			'pagebeforehide',
			'pagehide',
			'pageremove',
			'pagebeforechange',
			'pagebeforeload',
			'pageload',
		];
		this.eventMap = {
			bC: "pagebeforechange", bl: "pagebeforeload",
			l: "pageload",
			bc: "pagebeforecreate", c: "pagecreate",
			bs: "pagebeforeshow", s: "pageshow",
			bh: "pagebeforehide", h: "pagehide",
			i: "pageinit", rm: "pageremove",
		};
		this.routeController = controller;

		this.mapRoutesToHandlers(routes, controller);
		// this.initRouteHandlerMap();		
		this.start();
	}

	_.extend( RouteDispatcher.prototype, {
		/**
		 *  Set the first index in the historyStack with the
		 *  first route path. 
		 *  @TODO - must provide another way to bind to route changes
		 */
		start: function(){
			console.log('%c RouteDispatcher::: start', 'color: blue', this)
			window.historyObserver.on('navigate', function(route){
				this.handleRoute(route);
			}, this);
		},

		handleRoute: function(route){
			var idx = this.getRouteHandlerIndex(route);
			if( idx > -1 ) {
				console.log('%c RouteDispatcher::: Route and Handler at index::: ', 'color:blue', idx);
				this.runLoopForIndex(idx);
			} else {
				console.log('%c RouteDispatcher::: No Handler for this route', 'color:red')
			}
		},

		getRouteHandlerIndex: function(route){
			var resultIndex = -1;
			_.map(this.routes, function(regex, index){
				if( route.match(regex) !== null ) {
					resultIndex = index;
				}
			}, this);
			return resultIndex;
		},

		mapRoutesToHandlers: function(routes){
			var _routeNameMap = [];
			var _handlerQueue = [];
			_.map(routes, function(handlers, routeName){
				var _eventMap = {};
				_routeNameMap.push(routeName);
				// console.log('route', routeName)
				_.map(handlers, function(handler){
					// console.log('handlerEv', handler.events);
					_.map(handler.events, function(evShortName){
						var _routeEventName = this.eventMap[evShortName];
						if(_eventMap[_routeEventName] === undefined ) {
							_eventMap[_routeEventName] = [];	
						}
							// console.log('evShort', _routeEventName)
							// console.log('handlerObj', handler)
						_eventMap[_routeEventName].push(handler.handler);
					}, this); // handler
					_.map(this.eventCallOrder, function(event){
					}, this); // evOrder
				},this); // handlers
				// console.log('evMap',_eventMap)
				_handlerQueue.push(_eventMap);
			}, this); // routes
			// console.log(_routeNameMap);
			// console.log(_handlerQueue);
			this.routes = _routeNameMap;
			this.routeHandlers = _handlerQueue;
		},

		runLoopForIndex: function(idx){
			var _routeHandlerQueue = this.routeHandlers[idx] ;
			_.map(this.eventCallOrder, function(event){
				console.log('on:',event,' -- call::',_routeHandlerQueue[event])
			}, this);

		}


	}); // end extend

	return RouteDispatcher;

});