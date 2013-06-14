define([
 'underscore', 
 'backbone',
 'controllers/HistoryManager',
 'controllers/RouteDispatcher',
 'controllers/EventLoopRouter'

], function(_, Backbone, HistoryManager, RouteDispatcher, EventLoopRouter){
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
					events: ['s', 'bs']
				}
				],
				'pageB': [
				{
					handler: 'loadB',
					events: ['l']
				}],
				'pageC': [
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
					$('#notifications').text('loadA');
					console.log('%c loadA aaacalled', 'color:red');
					var dfd = $.Deferred();
					setTimeout(function(){
						dfd.resolve();
					}, 2000);
					return dfd.promise();

				},
				beforeShowAHandler: function(){
					console.log('%c beforeShowAHandler called', 'color:red');
					$('#notifications').text('beforeShowAHandler')
					var dfd = $.Deferred();
					$.ajax({
						url: 'pageA.html',
						dataType: 'text/html',
						type: 'get'
					}).complete(function(res){
						console.log($(res.responseText) )
						dfd.resolve();
					});
					return dfd.promise();
				},
				afterShowAHandler: function(){
					console.log('%c afterShowAHandler called', 'color:red');
					
					var dfd = $.Deferred();
					setTimeout(function(){
					$('#notifications').text('afterShowAHandler')
						dfd.resolve();
					}, 2000);
					return dfd.promise();
				},
				
				loadB: function(){
					$('#notifications').text('loadB')
					console.log('loadB called');
				},
				loadC: function(){
					$('#notifications').text('loadC')
					console.log('loadC called');
				},
				afterLoadC: function(){
					console.log('%c afterLoadC called', 'color:red');
					$('#notifications').text('afterLoadC')
					var dfd = $.Deferred();
					setTimeout(function(){
					
						dfd.resolve();
					}, 2000);
					return dfd.promise();
				},
			};

			var eventRouter = new EventLoopRouter(routes, routeController);
			

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

			$('a').click(function(evt){
				evt.preventDefault();
				if (eventRouter.isReady() ) {
					window.location.hash = $(this).attr('href');
				}
				// console.log('clicked', this)
			})

			var notificationHolder = $('<div id="notifications"> </div>');
			notificationHolder.css({
				position: 'absolute',
				right: '10px',
				top:'10px',
				background: '#90EE90',
				height: '40px',
				width: '200px',
				padding: '20px',
				'line-height': '20px'
			});
			$('body').append( notificationHolder );

			// var routes = {
			// 	'routeName' : [ {
			// 		handler: 'someHandler',
			// 		events: ['l','bs','s']
			// 	}, {
			// 		handler: 'someOtherHandler',
			// 		events: ['l','i']
			// 	} ]
			// }


			
			Backbone.history.start();
			// var router = new RouteDispatcher(routes, routeController);


		} // end start

	});

	return MyController;

});