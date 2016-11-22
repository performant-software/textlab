TextLab.Document = Backbone.Model.extend({
  urlRoot: "documents",
      
  afterLoad: function( model ) {
    this.leafs = new TextLab.LeafCollection( model["leafs"], { documentID: model["id"] } );
    this.documentNodes = new TextLab.DocumentNodeCollection( model["document_nodes"], { document: this } );
    this.documentSections = new TextLab.DocumentSectionCollection( model["sections"] );
    this.members = new TextLab.MembershipCollection( model["members"] );
    this.leafs.document = this;
    this.documentNodes.document = this;
    this.documentSections.document = this;
    this.members.document = this;
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
    section.set("document_id", this.id );
    this.documentSections.add( section );
  },
  
  addLeaf: function( leaf, parentNode ) {
    leaf.set("document_id", this.id );
    this.leafs.add( leaf );
  },

  parseLeafManifest: function(leafManifest) {

    // read this text a line at a time, create a JSON representation of it to send to server.

    var lines = leafManifest.split('\n');
    var leafs = [];

    _.each( lines, function(line) {
      var fields = line.split(',');
      // expect exactly 3 columns in each line
      if( fields.length == 3 ) {
        var leaf = {};
        for( var i=0; i < fields.length; i++ ) {
          var field = fields[i];
          if( i == 0 ) {
            leaf.name = field;
          } 
          else if( i == 1 ) {
            leaf.xml_id = field;
          }
          else if( i == 2 ) {
            leaf.tile_source = field;
          }
        }
        leafs.push(leaf);        
      } else {
        // unexpected number of fields
        return null;
      }
    });

    return leafs;
  }
      
});

TextLab.DocumentCollection = Backbone.Collection.extend({
  model: TextLab.Document,
  url: "documents"
}); 