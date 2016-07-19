TextLab.Document = Backbone.Model.extend({
  urlRoot: "documents",
      
  afterLoad: function( model ) {
    this.leafs = new TextLab.LeafCollection( model["leafs"], { documentID: model["id"] } );
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
  
  addLeaf: function( leaf ) {
    leaf.set("document_id", this.id );
    this.leafs.add( leaf );
  }
  
});

TextLab.DocumentCollection = Backbone.Collection.extend({
  model: TextLab.Document,
  url: "documents"
}); 