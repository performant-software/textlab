TextLab.DocumentExplorer = Backbone.View.extend({
    
	template: JST['textlab/templates/document-explorer'],
  
  // IIIF format {scheme}://{server}{/prefix}/{identifier}/{region}/{size}/{rotation}/{quality}.{format}
  thumbnailURLTemplate: _.template("<%= src %>/full/<%= width %>,/0/default.jpg"),

  thumbWidth: 100,

  id: 'document-explorer',
    
  events: {
    "click .document-node": "onClickNode"
  },
            	
	initialize: function(options) {
    // need document and which part to display initially (which might be null)
    this.currentSection = null;
    this.mainViewport = options.mainViewport;
  },
  
  selectSection: function(sectionNode) {
    // TODO get the list of leaves for this section and render them.. 
    // also need to render folders and leaves with no images.
    this.currentSection = sectionNode;
    this.render();
  },

  onClickNode: function(event) {
    var itemIcon = $(event.currentTarget);
    var nodeID = parseInt(itemIcon.attr("data-id"));    

    var documentNode = _.find( this.model.documentNodes.models, function( documentNode ) {
      return (documentNode.id == nodeID );     
    });  

    if( documentNode.isLeaf() ) {
      // if it is a leaf, goto the leaf view for that leaf (via primary view)
      var leaf = documentNode.getLeaf();
      this.mainViewport.selectLeaf(leaf);
    } else {
      // if it is a subsection, switch sections
      this.selectSection(documentNode);
    }
  },

  render: function() {
    var items = [];
    if( this.currentSection ) {
      var nodes = this.currentSection.getChildren();
      items = _.map( nodes, function(node) {

        if( node.isLeaf() ) {
          var leaf = node.getLeaf();
          var tileSource = leaf.get('tile_source');
          if( tileSource ) {
            var thumbnailURL = this.thumbnailURLTemplate({ src: leaf.get('tile_source'), width: this.thumbWidth });
            return { nodeType: 'thumb', name: leaf.get('name'), imgSrc: thumbnailURL, id: node.id };
          } else {
            return { nodeType: 'blank-thumb', name: leaf.get('name'), id: node.id };
          }
        } 
        else if( node.isSection() ) {
          var section = node.getSection();
          return { nodeType: 'section', name: section.get('name'), id: node.id };
        }
      }, this);
    } 

    this.$el.html(this.template({ items: items }));
  } 
    
});