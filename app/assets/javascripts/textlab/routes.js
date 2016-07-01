
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
    }, this));            
  },
  
  documentEditView: function() {
    var primaryEditingView = new TextLab.PrimaryEditingView();
    primaryEditingView.render();    
  },
    
  testPage: function() {
    var testPage = new TextLab.TestPage();
    testPage.render();
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