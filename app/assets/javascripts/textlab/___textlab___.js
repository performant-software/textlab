
// application namespace
var TextLab = {};

// application main
$(document).ready(function() {
  
  var routes = new TextLab.Routes(TextLabSettings);
  Backbone.history.start();
  
});