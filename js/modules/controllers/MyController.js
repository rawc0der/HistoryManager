define([
 'underscore', 
 'backbone',
 'controllers/HistoryManager'

], function(_, Backbone, HistoryManager){
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


			var pageLinkA = $('<a>Page A</a>').attr('href', '#pageA')
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

		} // end start

	});

	return MyController;

});