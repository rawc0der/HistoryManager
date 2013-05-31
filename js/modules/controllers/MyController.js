define([
 'underscore', 
 'backbone',
 'controllers/HistoryManager',
 'controllers/RouteDispatcher'

], function(_, Backbone, HistoryManager, RouteDispatcher){
	/**
	 * Controller Object responsible for View construction and application event flow
	 * @type {[Object]}
	 */
	var MyController = _.extend( {}, Backbone.Events );
	/**
	 * Define application logic here, by extending the Controller
	 */
	_.extend( MyController, {
		/**
		 * Function called immediately after App Initialize 
		 */
		start: function(){
			
			console.log('Controller::Start  --> define logic');	
			
			var history = new HistoryManager();

			// history.addNewEntry('/latest/HistoryManager/page-0')
			// history.addNewEntry('/latest/HistoryManager/page-2')
			// history.addNewEntry('/latest/HistoryManager/page-3')
			// history.addNewEntry('/latest/HistoryManager/page-4')


			var pageLinkA = $('<a>Page A</a>').attr('href', '#pageA?id=12')
			var pageLinkB = $('<a>Page B</a>').attr('href', '#pageB')
			var pageLinkC = $('<a>Page C</a>').attr('href', '#pageC')
			var pageLinkD = $('<a>Page D</a>').attr('href', '#pageD')

			$('body').append( pageLinkA ).append( '<br>' )
			$('body').append( pageLinkB ).append( '<br>' )
			$('body').append( pageLinkC ).append( '<br>' )
			$('body').append( pageLinkD ).append( '<br>' )

			$('a').click(function(){
				// console.log('clicked', this)
			})

			// var routes = {
			// 	'routeName' : [ {
			// 		handler: 'someHandler',
			// 		events: ['l','bs','s']
			// 	}, {
			// 		handler: 'someOtherHandler',
			// 		events: ['l','i']
			// 	} ]
			// }


			var routes = {
				'pageA[?]id=(\\d+)': [
				{
					handler: 'loadA',
					events: ['i']
				},
				{
					handler: 'beforeShowAHandler',
					events: ['bs']
				},
				{
					handler: 'afterShowAHandler',
					events: ['s', 'i']
				}
				],
				'#pageB': [
				{
					handler: 'loadB',
					events: ['l']
				}],
				'/pageC': [
				{
					handler: 'loadC',
					events: ['l', 'bs', 's', 'i']
				},
				{
					handler: 'afterLoadC',
					events: ['l', 'i']
				}]
			};

			var routeController = {
				loadA: function(){
					console.log(' loadA reached');
				},
				beforeShowAHandler: function(){
					console.log('afterRenderA called');
				},
				afterShowAHandler: function(){
					console.log('afterRenderA called');
				},
				
				loadB: function(){
					console.log('loadB called');
				},
				loadC: function(){
					console.log('loadC called');
				}
			};


			var router = new RouteDispatcher(routes, routeController);


		} // end start

	});

	return MyController;

});