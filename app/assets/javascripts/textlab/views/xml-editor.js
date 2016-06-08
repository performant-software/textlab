TextLab.XMLEditor = Backbone.View.extend({
    
  id: 'xml-editor',
            	
	initialize: function(options) {
  },
      
  render: function() {      
    this.$el.html("<textarea id='codemirror'></textarea>");        
  },
  
  initEditor: function() {
    var editorEl = this.$("#codemirror").get(0);
		this.editor = CodeMirror.fromTextArea( editorEl, {
        mode: "xml",
        lineNumbers: true
		});    
  }  
  
});