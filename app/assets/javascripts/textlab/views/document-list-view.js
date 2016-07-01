TextLab.DocumentListView = Backbone.View.extend({

	template: JST['textlab/templates/document-list-view'],
    
  id: 'document-list-view',
  
  events: {
    'click .new-document-button': "onNewDocument",
    'click .delete-document-button': "onDeleteDocument"    
  },
            	
	initialize: function(options) {
    _.bindAll( this, "onNewDocument" );
  },
  
  onNewDocument: function() {    
    var onCreateCallback = _.bind(function(doc) {
      this.collection.add(doc);
      doc.save(null, { success: _.bind( function() {
        this.render();
      },this)});
    }, this);
          
    var doc = new TextLab.Document();
    var documentModalDialog = new TextLab.NewDocumentDialog( { model: doc, callback: onCreateCallback } );
    documentModalDialog.render();    
  },
  
  onDeleteDocument: function(e) {
    // TODO
    
    
  },
  
  render: function() {          
    this.$el.html(this.template({ documents: this.collection.toJSON() }));
    $(".textlab-app").html(this.$el);      
  }
  
});