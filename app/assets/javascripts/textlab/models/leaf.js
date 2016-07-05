TextLab.Leaf = Backbone.Model.extend({
  urlRoot: "leafs",
  
  // TODO has a tile source url, a collection of zones, xml, sequences, parent, order #
  
  initialize: function( attributes, options ) {
    this.afterLoad( attributes );
  },
  
  afterLoad: function( attributes ) {
    this.zones = new TextLab.ZoneCollection( attributes["zones"], { leafID: attributes["id"] } );
  },
  
  sync: function(method, model, options) {
    
    // add hook for afterLoad event that does something after the model has been loaded
    if( this.afterLoad && (method == 'read' || method == 'create') ) {    
      if( options.success ) {
        var originalCallback = options.success;
        options.success = _.bind( function( attributes ) { 
          this.afterLoad( attributes );
          originalCallback( attributes );
        }, this);
      } else {
        options.success = _.bind( this.afterLoad, this );
      }      
    }
    
    Backbone.sync(method, model, options);
  }
    
});

TextLab.LeafCollection = Backbone.Collection.extend({
  model: TextLab.Leaf,
  url: "leafs",
    
  addLeaf: function( leaf ) {
    leaf.set("document_id", this.documentID );
    this.add( leaf );
  }      
  
}); 