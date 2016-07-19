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
              	
	initialize: function(options) {
    _.bindAll( this, "onNodeSelected" );
  },
  
  onNodeSelected: function() {
    // TODO    
  },
  
	generateTreeModel: function() {

    var leafNodes = _.map( this.model.leafs.models, function( leaf ) {
      return { key: 'leaf-'+leaf.id, title: leaf.get('name'), expanded: false, children: [], icon: 'fa fa-file-o fa-lg' }
    });

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