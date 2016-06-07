TextLab.DocumentTreeView = Backbone.View.extend({

	template: JST['textlab/templates/document-tree-view'],
    
  id: 'document-tree-view',
            	
	initialize: function(options) {
  },
      
  render: function() {      
    
    this.$el.html(this.template({}));  

	
  }
  
  
});