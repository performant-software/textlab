// ajaxRequestQueue
// A simple queing mechanism to allow us to keep track of asynchronous
// requests kicked off by $.ajax

// Init the queue if it doesn't exist
if(!window.ajaxRequestQueue){
	window.ajaxRequestQueue=[];
}

function ajaxRequestQueue_cancelQueue(){
	debugger
	for(var x=0;x<window.ajaxRequestQueue.length;x++){
		console.log('Canceling: '+ window.ajaxRequestQueue[x].responseText);
		console.log(window.ajaxRequestQueue[x].res);
		window.ajaxRequestQueue[x].abort();
	}
}

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
           && window.ajaxRequestQueue[i].responseText.hasOwnProperty('id')
           && (arguments.length > 2 && window.ajaxRequestQueue[i].responseText['id'] === id ) ){
           window.ajaxRequestQueue.splice(i,1);
		   console.log("Removing: "+id);
       }
    }
}
