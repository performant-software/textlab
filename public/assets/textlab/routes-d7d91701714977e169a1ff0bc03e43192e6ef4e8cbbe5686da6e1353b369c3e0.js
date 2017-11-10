
TextLab.Routes = Backbone.Router.extend({

  routes: {
    "" : "documentListView",
    "documents/:id" : "documentEditView",
    "admin" : "adminView",
    "sites" : "siteListView"
  },
    
  initialize: function(options) {
    
    _.bindAll( this, "onError" );
                      
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

  adminView: function() {
    if( TextLabSettings.user_type == 'user' ) return;
    
    this.loadUsers( _.bind( function(users) {
      var userListView = new TextLab.UserListView( { collection: users });
      userListView.render();
      $(".textlab-app").html(userListView.$el);      
    }, this));     
  },

  siteListView: function() {
    if( TextLabSettings.user_type == 'user' ) return;
    
    this.loadSites( _.bind( function(sites) {
      var siteListView = new TextLab.SiteListView( { collection: sites });
      siteListView.render();
      $(".textlab-app").html(siteListView.$el);      
    }, this));     
  },
      
  /////////////////////////
  
  loadDocuments: function( initView ) {
    var documents = new TextLab.DocumentCollection();
    documents.fetch( { success: initView, error: this.onError } );
  },  

  loadUsers: function( initView ) {
    var users = new TextLab.UserCollection();
    users.fetch( { success: initView, error: this.onError } );
  }, 

  loadSites: function( initView ) {
    var sites = new TextLab.SiteCollection();
    sites.fetch( { success: initView, error: this.onError } );
  }, 
  
  onError: function( collection, response, options ) {
    console.log( "Server Error: \n"+response );
  }    

});
