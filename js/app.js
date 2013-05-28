define([
  'jquery', 
  'underscore', 
  'backbone',
  'controllers/MyController',
  'modules/MyModule'

], function($, _, Backbone, MyController, MyModule){
  /**
   * Main Application File Module
   * Store Components inside this object for global refs handles
   * @type {[type]}
   */
  var App = {};

  _.extend ( App, {
    /**
     * Application Entry point. It is called the first time DOM finishes loading
     * @return {[function]} 
     */
      initialize: function(){

        console.log('Development App::initialize', this);

        window.historyObserver = _.extend({}, Backbone.Events);

        var RouteDispatcher = Backbone.Router.extend({
            routes: {
              'pageA': 'pageA',
              'pageB': 'pageB',
              'pageC': 'pageC',
              'pageD': 'pageD',
            },
            pageA: function(){
                // console.log('%c navigate to PAGE A', 'color:red');
                var route = window.location.href.replace( window.location.origin, '' )
                window.historyObserver.trigger('navigate', route)
            },
            pageB: function(){
                // console.log('%c navigate to PAGE B', 'color:red');
                var route = window.location.href.replace( window.location.origin, '' )
                window.historyObserver.trigger('navigate', route)
            },
            pageC: function(){
                // console.log('%c navigate to PAGE C', 'color:red');
                var route = window.location.href.replace( window.location.origin, '' )
                window.historyObserver.trigger('navigate', route)
            },
            pageD: function(){
                // console.log('%c navigate to PAGE D', 'color:red');
                var route = window.location.href.replace( window.location.origin, '' )
                window.historyObserver.trigger('navigate', route)
            },

          });

          var Router = new RouteDispatcher();
          Backbone.history.start();


        this.Controller.start();

        return this;

      },

      Controller: MyController,

      CustomModule: MyModule

    });

  return App;
});