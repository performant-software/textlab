
// application namespace
var TextLab = {};

// application main
$(document).ready(function() {

  var leafViewer = new TextLab.LeafViewer({ el: $('#leaf-viewer'), tileSource: LeafSettings.tileSource } );
  leafViewer.render();
  
});