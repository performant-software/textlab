TextLab.DocumentTreeView = Backbone.View.extend({

	template: JST['textlab/templates/document-tree-view'],
    
  id: 'document-tree-view',

	glyphConfig: {
      map: {
        expanderClosed: "fa fa-plus-square",
        expanderOpen: "fa fa-plus",
        loading: "glyphicon glyphicon-refresh"
      }
	},
  
  events: {
    'click .add-leaf-button' : 'onAddLeaf',
    'click .add-section-button' : 'onAddSection'    
  },
              	
	initialize: function(options) {
    this.mainViewport = options.mainViewport;
    
    _.bindAll( this, "onNodeSelected" );
  },
  
  onAddLeaf: function() {
    var onCreateCallback = _.bind(function(leaf) {
      this.model.addLeaf(leaf);
      leaf.save(null, { success: _.bind( function() {
        // TODO update tree
        console.log('leaf save success')
      },this)});
    }, this);
          
    var leaf = new TextLab.Leaf();
    var leafDialog = new TextLab.LeafDialog( { model: leaf, callback: onCreateCallback } );
    leafDialog.render();    
  },
  
  onAddSection: function() {
    // TODO bring up the section dialog    
  },
  
  onNodeSelected: function(e, data) {
    
    // if this is a leaf, activate it
    if( data.node.data.leaf ) {
      var leaf = data.node.data.leaf;
      this.mainViewport.selectLeaf(leaf);
    }
    
    // TODO if this is a section, display preview of section
    
  },
  
  generateLeafNode: function(leaf) {
    return { key: 'leaf-'+leaf.cid, title: leaf.get('name'), leaf: leaf, expanded: false, children: [], icon: 'fa fa-file-o fa-lg' }    
  },
  
	generateTreeModel: function() {

    var leafNodes = _.map( this.model.leafs.models, function( leaf ) {
      return this.generateLeafNode(leaf);
    }, this);

		return [{ 
      key: "root", 
		  title: this.model.get('name'), 
      expanded: true,
      children: leafNodes,
      icon: 'fa fa-lg fa-folder'
    }];
	},
      
  render: function() {      
    
		var documentTreeModel = this.generateTreeModel();
					
		if( !this.fancyTree ) {
			this.$el.html(this.template());

			var documentTree = this.$('#document-tree');		
			documentTree.fancytree({ source: documentTreeModel, 
									  click: this.onNodeSelected,
									  selectMode: 1,
                    aria: true,
                    extensions: [ 'glyph', 'clones' ],
                    glyph: this.glyphConfig });
			
			this.fancyTree = documentTree.fancytree("getTree");
		} else {
			this.fancyTree.reload(documentTreeModel);
		}
													
		// TODO select the current node
    // var treeNode = this.getFancyNode(selectedNode.id);
    // treeNode.setActive(true);
	
  }
  
  
});

// TextLab.DocumentTreeView.elementNames = { front: "Front Matter", body: "Document Body", back: "Back Matter" };
// TextLab.DocumentTreeView.elementIcons = { front: "book", body: "book", back: "book", div: "stop" };
// TextLab.DocumentTreeView.divWithoutHeadingMessage = "<i>untitled div</i>";
//
// TextLab.DocumentTreeView.getDisplayName = function( annotation ) {
//   var name = HumEdit.DocumentStructurePanel.elementNames[ annotation.tag ];
//   var head = annotation.data.head;
//   var heading = ( head && head.length > 0) ? head : HumEdit.DocumentStructurePanel.divWithoutHeadingMessage;
//   return name ? name : heading;
// };
//
// TextLab.DocumentTreeView.getIcon = function( annotation ) {
//   var icon = HumEdit.DocumentStructurePanel.elementIcons[ annotation.tag ];
//   return icon ? "glyphicon glyphicon-"+icon : "";
// };