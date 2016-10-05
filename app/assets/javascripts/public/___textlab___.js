
// application namespace
var TextLab = {};

// application main
$(document).ready(function() {

  var diplomaticPanel = new TextLab.DiplomaticPanel({ el: $('#diplomatic-panel') } );
  diplomaticPanel.render();
  
});