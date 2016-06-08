TextLab.XMLEditor = Backbone.View.extend({
    
  id: 'xml-editor',
            	
	initialize: function(options) {
  },
      
  render: function() {      
    
		this.editor = CodeMirror( this.el, {
		});
  }
  
  
});