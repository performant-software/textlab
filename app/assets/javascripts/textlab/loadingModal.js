/*
loadingModal.js

Starts make the CSS visible.
Stops are on a timer so that the model doesn't "flicker" if we call start multiple times in a row
*/

// Start the spinner
function loadingModal_start(){
	// Cancel any pending stops
	if(window.spinnerTimer){
		clearTimeout(window.spinnerTimer);
        window.spinnerTimer = 0;
	}
	// Make sure loading is visible
	$("#loadingStateModal").fadeIn("fast");
}

// Stop the spinner
function loadingModal_stop(){
	// Request a stop
	window.spinnerTimer = setTimeout(function(){
			$("#loadingStateModal").fadeOut("fast");
	}, 200);
}
