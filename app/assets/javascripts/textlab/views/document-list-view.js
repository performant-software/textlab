TextLab.DocumentListView = Backbone.View.extend({

	template: JST['textlab/templates/document-list-view'],
    
  id: 'document-list-view',
  
  events: {
    'click .new-document-button': "onNewDocument",
    'click .delete-document-button': "onDeleteDocument"    
  },
            	
	initialize: function(options) {

  },
  
  onNewDocument: function() {
    // TODO
  },
  
  onDeleteDocument: function() {
    // TODO
  },
  
  render: function() {          
    this.$el.html(this.template({ documents: this.collection }));
    $(".textlab-app").html(this.$el);      
  }
  
});