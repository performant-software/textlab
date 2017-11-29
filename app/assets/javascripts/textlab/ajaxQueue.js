// ajaxRequestQueue
//
// A simple queing mechanism to allow us to keep track of asynchronous
// requests kicked off by $.ajax
////////////////////////////////////////////////////////////////////////////////


// Init the queue if it doesn't exist
if(!window.ajaxRequestQueue){
	window.ajaxRequestQueue=[];
}

// Clear out the queue
// FIXME: this is not the smartest implementation, it would be nicer
// if we maintained this queue (IE removed elements when properly fulfilled, for example)
// but this just cancels everything (including harmlessly canceling events that may already be complete)
function ajaxRequestQueue_cancelQueue(){
	for(var x=0;x<window.ajaxRequestQueue.length;x++){
		var data = window.ajaxRequestQueue[x].responseText;
		if(data.length > 0){
			var requestObj = JSON.parse(data);
			requestObj=requestObj[0];
			console.log('Canceling: '+ requestObj.id);
			window.ajaxRequestQueue[x].abort();
		}
	}
	window.ajaxRequestQueue.length=0;
}

/*
function ajaxRequestQueue_removeID(id){
	console.log("Queue: "+window.ajaxRequestQueue);
	console.log(window.ajaxRequestQueue);

	console.log("Looking for: "+id);
	for(var x=0;x<window.ajaxRequestQueue.length;x++){
		console.log(window.ajaxRequestQueue[x].responseText);

	}

	var i = window.ajaxRequestQueue.length;
    while(i--){
       if( window.ajaxRequestQueue[i]
	   var data = window.ajaxRequestQueue[x].responseText;
	   var requestObj = JSON.parse(data);
	   requestObj=requestObj[0];
           && window.ajaxRequestQueue[i].responseText.hasOwnProperty('id')
           && (arguments.length > 2 && window.ajaxRequestQueue[i].responseText['id'] === id ) ){
           window.ajaxRequestQueue.splice(i,1);
		   console.log("Removing: "+id);
       }
    }
}
*/
