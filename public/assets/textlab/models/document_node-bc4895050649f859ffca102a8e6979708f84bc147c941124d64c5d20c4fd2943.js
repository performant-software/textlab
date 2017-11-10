TextLab.DocumentNode = Backbone.Model.extend({
  urlRoot: "document_nodes",
  
  initialize: function( attributes, options ) {
    
  },
  
  getChildren: function() {
    var nodeID = this.id;
    var documentNodes = this.collection.document.documentNodes;
    var children = documentNodes.where({ document_node_id: nodeID });
    return children;
  },

  getAncestors: function() {
    var ancestors = [];
    var node = this;
    var parentNode = node.getParent();

    while( parentNode != null ) {
      ancestors.push(parentNode);
      node = parentNode;
      parentNode = node.getParent();
    }

    return ancestors.reverse();
  },
  
  getParent: function() {
    var documentNodes = this.collection.document.documentNodes;
    return documentNodes.findWhere({ id: this.get('document_node_id') }); 
  },
  
  getSection: function() {
    var sectionID = this.get('document_section_id');
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
    return this.get('document_section_id') != null;    
  },
  
  isRoot: function() {
    return this.get('document_node_id') == null;
  }
    
});

TextLab.DocumentNodeCollection = Backbone.Collection.extend({
  model: TextLab.DocumentNode,
  url: "document_nodes"
}); 
