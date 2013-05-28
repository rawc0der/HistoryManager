define([
 'underscore', 
 'backbone'


], function(_, Backbone){
	/**
	 * History Object responsible for holding navigation entries.
	 * @Array historyStack - array container, holding route path names
	 * @number activeIndex - current route index from the historySrack array
	 * @number previousIndex - last visited route index from the historyStack
	 */
	var HistoryManager = function(stack, activeIndex){
		this.historyStack = stack || [] ;
		this.activeIndex = activeIndex || -1;
		this.previousIndex = null;
		this.start();
	}

	_.extend( HistoryManager.prototype, {
		/**
		 *  Set the first index in the historyStack with the
		 *  first route path. 
		 *  @TODO - must provide another way to bind to route changes
		 */
		start: function(){
			console.log('%c HistoryManager::: start', 'color: blue', this)
			var firstEntry = window.location.href.replace( window.location.origin, '' )
			this.historyStack[0] = firstEntry;
			this.activeIndex = 0;
			////////////connect with routeDispatcher/////////////////
			window.historyManager = this;
			var historyManager = this;
			window.historyObserver.on('navigate', function(route){
				historyManager.navigateToEntry( route );
			});
			///////////end////////////////
		},
		/**
		 *	Navigate to a new root and add it to the historyStack if 
		 *  it's not found in the visited paths.
		 *          	-- or --
		 *  If the entry is found in the historyStack, set the previousIndex to 
		 *  the current activeIndex and navigate to the entry.
		 *	Refresh the history indexes
		 */
		navigateToEntry: function( entry ){
			// console.log('%c HistoryManager::: navigateToEntry', 'color: green')
			var visitedEntryIndex = this.find( entry );
			if( visitedEntryIndex === -1 ) {  
				// stateless request (new Route)
				this.addNewEntry(entry);
				this.goForward();
			} else {  
				// stateful request (Back button)
				var direction = (visitedEntryIndex < this.activeIndex) ? 'Back' : 'Forward';
				this.previousIndex = this.activeIndex;
				this.activeIndex = visitedEntryIndex;
				console.log('%c HistoryManager::: navigateToEntry ', 'color:purple', this.getActiveEntryName() );
				this['go'+direction]();
				// console.log(this);
			}
		},
		/**
		 *	Navigate to an index from the historyStack
		 *	Refresh the history indexes
		 */
		navigateToIndex: function(index){
			if (index > this.historyStack.length - 1) {
				throw 'Array out of bounds';
			} else {
				// console.log('%c HistoryManager::: goToIndex', 'color: green', index)
				this.previousIndex = this.activeIndex;
				this.activeIndex = index;
				// console.log('Current path: ', this.getActiveEntryName() );
			}
		},
		/**
		 *	handleGoBack Logic
		 */
		goBack: function(){
			// console.log('%c HistoryManager::: goBack', 'color: green')
			console.log('%c HistoryManager::: useBackTransition', 'color: red')
		},
		/**
		 *	handleGoForward Logic
		 */
		goForward: function(){
			// console.log('%c HistoryManager::: goForward', 'color: green')
			console.log('%c HistoryManager::: useForwardTransition', 'color: green')
		},
		/**
		 *	Clear the Array from the activeIndex to the tail 
		 *  Add the routePathName entry to the historyStack Array 
		 *  Refresh the history indexes
		 */
		addNewEntry: function( routePathName ){
			this.clearTail();
			console.log('%c HistoryManager::: addNewEntry', 'color: purple', routePathName)
			this.historyStack.push( routePathName );
			this.previousIndex = this.activeIndex;
			this.activeIndex = this.historyStack.length -1;
			// console.log(this)
		},
		/**
		 *	Get the route path name of the current Active entry 
		 */
		getActiveEntryName: function(){
			// console.log('%c HistoryManager::: getActiveEntry', 'color: green')
			return this.historyStack[ this.activeIndex ];
		},
		/**
		 *	Get the route path name of the last Visited entry 
		 */
		getLastVisitedEntryName: function(){
			// console.log('%c HistoryManager::: getLastVisitedEntry', 'color: green')
			return this.historyStack[ this.previousIndex ];
		},
		/**
		 *	Get the Name of the entry one index lower than the current activeIndex
		 */
		getPreviousEntryName: function(){
			// console.log('%c HistoryManager::: getPreviousEntry', 'color: green')
			return this.historyStack[ this.activeIndex - 1 ];
		},
		/**
		 *	Get the Name of the entry one index higher than the current activeIndex
		 */
		getNextEntryName: function(){
			// console.log('%c HistoryManager::: getNextEntry', 'color: green')
			return this.historyStack[ this.activeIndex + 1 ];
		},
		/**
		 *	Clear all the entries after the current activeIndex
		 */
		clearTail: function(){
			// console.log('%c HistoryManager::: clearTail', 'color: green')
			this.historyStack.splice( this.activeIndex + 1, this.historyStack.length 
				)

		},
		/**
		 *	Get the index from historyStack Array if the routePathName 
		 *  is found inside.
		 */
		find: function( routePathName ){
			var atIndex = -1;
			_.map( this.historyStack , function( entry, key ){
				if ( entry === routePathName ) {
					atIndex = key;
				} 
			}, this)
			// console.log('%c HistoryManager::: find', 'color: green', atIndex)
			return atIndex;
		}



	}); // end extend

	return HistoryManager;

});