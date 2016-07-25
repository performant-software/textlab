TextLab.DocumentExplorer = Backbone.View.extend({
    
	template: JST['textlab/templates/document-explorer'],
  
  id: 'document-explorer',
    
  events: {
  },
            	
	initialize: function(options) {
    // need document and which part to display initially (which might be null)
    
  },
  
  selectSection: function(section) {
    // TODO
  },
    
  render: function() {
    this.$el.html(this.template({}));
    
  } 
    
});