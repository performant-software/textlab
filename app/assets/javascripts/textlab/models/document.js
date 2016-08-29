TextLab.Document = Backbone.Model.extend({
  urlRoot: "documents",
      
  afterLoad: function( model ) {
    this.leafs = new TextLab.LeafCollection( model["leafs"], { documentID: model["id"] } );
    this.documentNodes = new TextLab.DocumentNodeCollection( model["document_nodes"] );
    this.documentSections = new TextLab.DocumentSectionCollection( model["sections"] );
    this.leafs.document = this;
    this.documentNodes.document = this;
    this.documentSections.document = this;
  },
  
  sync: function(method, model, options) {
    
    // add hook for afterLoad event that does something after the model has been loaded
    if( this.afterLoad && (method == 'read' || method == 'create') ) {    
      if( options.success ) {
        var originalCallback = options.success;
        options.success = _.bind( function( model ) { 
          this.afterLoad( model );
          originalCallback( model );
        }, this);
      } else {
        options.success = _.bind( this.afterLoad, this );
      }      
    }
    
    Backbone.sync(method, model, options);
  },
  
  getRootNode: function() {
    return _.find( this.documentNodes.models, function( documentNode ) {
      return documentNode.isRoot();      
    });    
  },
  
  addSection: function( section ) {
    // TODO
  },
  
  addLeaf: function( leaf, parentNode ) {
    leaf.set("document_id", this.id );
    this.leafs.add( leaf );
  },
  
  saveTree: function( callback ) {
    // TODO reset the document node list with this list from the server
    this.model.set("documentNodesJSON", documentNodes.toJSON() );
    this.model.save( null, { success: callback, error: TextLab.Routes.routes.onError });
  }
    
});

TextLab.DocumentCollection = Backbone.Collection.extend({
  model: TextLab.Document,
  url: "documents"
}); 