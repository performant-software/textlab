TextLab.DocumentExplorer = Backbone.View.extend({
    
	template: JST['textlab/templates/document-explorer'],
  
  // IIIF format {scheme}://{server}{/prefix}/{identifier}/{region}/{size}/{rotation}/{quality}.{format}
  thumbnailURLTemplate: _.template("<%= src %>/full/<%= width %>,/0/default.jpg"),

  thumbWidth: 100,

  id: 'document-explorer',
    
  events: {
    "click .document-node": "onClickNode",
    "click #edit-info-button": "onEditInfo",
    "click .breadcrumb": "onClickBreadcrumb"
  },
            	
	initialize: function(options) {
    // need document and which part to display initially (which might be null)
    this.currentSection = null;
    this.mainViewport = options.mainViewport;
    this.documentTree = options.documentTree;
  },
  
  selectSection: function(sectionNode) {
    // TODO get the list of leaves for this section and render them.. 
    // also need to render folders and leaves with no images.
    this.currentSection = sectionNode;
    this.render();
  },

  selectNodeByID: function(nodeID) {
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

  onClickNode: function(event) {
    var itemIcon = $(event.currentTarget);
    var nodeID = parseInt(itemIcon.attr("data-id"));    
    this.selectNodeByID( nodeID );
  },

  onClickBreadcrumb: function(event) {
    var itemIcon = $(event.currentTarget);
    var nodeID = parseInt(itemIcon.attr("data-id"));
    this.selectNodeByID( nodeID );
    return false;
  },

  onEditInfo: function() {
    var callback = _.bind(function(section) {
      this.model.save( null, { 
        success: _.bind( function() {
          this.render();
          this.documentTree.render();
        }, this), 
        error: TextLab.Routes.routes.onError });
    }, this);
    
    var deleteCallback = _.bind(function(section) {   
      this.documentTree.deleteSectionNode(section);
      section.destroy({ 
        success: _.bind( function() { this.mainViewport.selectSection(null); }, this ), 
        error: TextLab.Routes.onError });            
    }, this);
    
    var section = this.currentSection.getSection();
    var sectionDialog = new TextLab.SectionDialog( { 
      model: section, 
      callback: callback, 
      deleteCallback: deleteCallback, 
      mode: 'edit' 
    });
    sectionDialog.render();     
    return false;  
  },

  render: function() {
    var items = [], ancestors = [], sectionName = "";
    if( this.currentSection ) {
      var nodes = _.sortBy( this.currentSection.getChildren(), function(node) { 
        return node.get('position');      
      } );
      
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

      ancestors = _.map( this.currentSection.getAncestors(), function( ancestor ) {
        var section = ancestor.getSection();
        return { name: section.get('name'), id: ancestor.id };
      });

      sectionName = this.currentSection.getSection().get('name');
    } 


    this.$el.html(this.template({ 
      name: sectionName, 
      ancestors: ancestors, 
      items: items,
      canEditSection: this.model.get('owner') 
    }));
  } 
    
});