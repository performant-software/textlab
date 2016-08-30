TextLab.DocumentNode = Backbone.Model.extend({
  urlRoot: "document_nodes",
  
  initialize: function( attributes, options ) {
    
  },
  
  getChildren: function() {
    var nodeID = this.id;
    var documentNodes = this.collection.document.documentNodes;
    var children = documentNodes.where({ parent_id: nodeID });
    return children;
  },
  
  nextPosition: function() {
    var children = this.getChildren();
    return children.length;
  },
  
  getSection: function() {
    var sectionID = this.get('section_id');
    if( sectionID == null ) return null;
    var documentSections = this.collection.document.documentSections.models;
    return _.find( documentSections, function( documentSection ) {
      return documentSection.id == sectionID;      
    });     
  },
  
  getLeaf: function() {
    var leafID = this.get('leaf_id');
    if( leafID == null ) return null;
    var leafs = this.collection.document.leafs.models;
    return _.find( leafs, function( leaf ) {
      return leaf.id == leafID;
    }); 
  },
  
  isLeaf: function() {
    return this.get('leaf_id') != null;    
  },
  
  isSection: function() {
    return this.get('section_id') != null;    
  },
  
  isRoot: function() {
    return this.get('parent_id') == null;
  }
    
});

TextLab.DocumentNodeCollection = Backbone.Collection.extend({
  model: TextLab.DocumentNode,
  url: "document_nodes"
}); 