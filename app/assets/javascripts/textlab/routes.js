
TextLab.Routes = Backbone.Router.extend({

  routes: {
    "" : "documentListView",
    "documents/:id" : "documentEditView"
  },
    
  initialize: function(options) {
                      
    // global singleton
    TextLab.Routes.routes = this;
        
  },
  
  documentListView: function() {
    this.loadDocuments( _.bind( function(documents) {
      var documentListView = new TextLab.DocumentListView( { collection: documents });
      documentListView.render();
      $(".textlab-app").html(documentListView.$el);      
    }, this));            
  },
  
  documentEditView: function( documentID ) {
    var doc = new TextLab.Document({ id: documentID });
    doc.fetch({ success: function(doc) {
      var primaryEditingView = new TextLab.PrimaryEditingView({ model: doc });
      primaryEditingView.render();    
      $(".textlab-app").html(primaryEditingView.$el);      
      primaryEditingView.postRender();
    }, error: this.onError });    
  },
      
  /////////////////////////
  
  loadDocuments: function( initView ) {
    var documents = new TextLab.DocumentCollection();
    documents.fetch( { success: initView, error: this.onError } );
  },  
  
   // TODO improve error handling
  onError: function( collection, response, options ) {
     alert(response);    
  }    

});