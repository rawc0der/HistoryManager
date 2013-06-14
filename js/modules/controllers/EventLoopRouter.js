define([
 'underscore', 
 'backbone'

], function(_, Backbone){ 

	var EventLoopRouter = Backbone.Router.extend({

		routes: {
			":route": function(route){
				// console.log('navigate ',r)
				this.handleRoute(route);
			}
		},

		initialize: function(routes, controller, options){
			console.log('%c EventLoopRouter::init', 'color:blue');
			console.log(this);
			this.setup(routes, controller, options);
		},
		setup: function(routes, controller, options){
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
			this.eventHandlerQueue = [];
			this.mapRoutesToHandlers(routes, controller);
			this.changeReadyState();
		},
		handleRoute: function(route){
			if ( this.isReady() ) {
				var idx = this.getRouteHandlerIndex(route);
				if ( idx > -1 )  {
					console.log('%c RouteDispatcher::: Route and Handler found in CallStack at index::: ', 'color:blue', idx);
					this.runLoopForIndex(idx);
				} else {
					console.log('%c RouteDispatcher::: No handler for this route', 'color:red')
				}
			} else {
					console.log('%c RouteDispatcher::: BUSY. Do nothing  for now', 'color:red')
			}
		},

		hasRouteHandler: function(route){
			if ( this.getRouteHandlerIndex(route) > -1 ) {
				return true;
			} 
			return false;
		},

		isReady: function(){
			if ( this.readyState === 1 ) {
				return true;
			}
			return false;
			// return ( this.readyState === 1 );
		},

		changeBusyState: function(){
			this.readyState = 0;
		},

		changeReadyState: function(){
			this.readyState = 1;
		},

		getRouteHandlerIndex: function(route){
			var resultIndex = -1;
			_.map(this.definedRoutes, function(regex, index){
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
			this.definedRoutes = _routeNameMap;
			this.routeHandlers = _handlerQueue;
		},

		runLoopForIndex: function(idx){
			var _routeHandlerQueue = this.routeHandlers[idx] ;
			_.map(this.eventCallOrder, function(event){
				// var _handlerQueue = [];
				// console.log('on:',event,' -- call::',_routeHandlerQueue[event])
				if(_routeHandlerQueue[event]) {
					_.map(_routeHandlerQueue[event], function(funcName){
						// _handlerQueue.push( this.routeController[ funcName ] );
						if(this.routeController[ funcName ]) {
							this.eventHandlerQueue.push( 
								this.routeController[ funcName ] 
							);
						}
					}, this);
					// console.log( _handlerQueue );
				}
			}, this);
			this.changeBusyState();
			this.runNextEventHandlers();
			
		},

		hasNextEventHandlerQueue: function(){
			if ( this.eventHandlerQueue.length ) {
				return true;
			}
			return false;
		},

		runNextEventHandlers: function(ev){
			if ( this.hasNextEventHandlerQueue() ) {
				var self = this;
				$.when( self.getNextEventHandlerQueue() ).then(function(res){
					console.log(self.eventHandlerQueue)
					self.runNextEventHandlers();
				});
			} else {
				this.changeReadyState();
			}
		},

		getNextEventHandlerQueue: function(){
			var dfd = $.Deferred();
			var self = this;
			$.when( self.getEventHandlers()() ).then(function(){
				dfd.resolve();
			});
			return dfd.promise();
		},

		getEventHandlers: function(){
			return this.eventHandlerQueue.shift();
		}
	});

	return EventLoopRouter;
});