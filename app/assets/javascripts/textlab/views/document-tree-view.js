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
  
  addDocumentNode: function( documentNode ) {    
    var callback = _.bind( function() {
      this.render();
      console.log('update tree success')      
    }, this);
    
    this.model.documentNodes.add( documentNode );                  
    documentNode.save( null, { success: callback, error: TextLab.Routes.routes.onError });
  },
  
  onAddLeaf: function() {
    var onCreateCallback = _.bind(function(leaf) {
      this.model.addLeaf(leaf);
      leaf.save(null, { 
        success: _.bind( function( leaf ) {  
          var rootNode = this.model.getRootNode();  
          var nextPosition = rootNode.nextPosition();    
          var leafNode = new TextLab.DocumentNode({ 
            document_node_id: rootNode.id, 
            leaf_id: leaf.id, 
            position: nextPosition, 
            document_id: this.model.id  
          });
          this.addDocumentNode(leafNode);
        },this),      
        error: TextLab.Routes.routes.onError 
      });
    }, this);          

    var leaf = new TextLab.Leaf();
    var leafDialog = new TextLab.LeafDialog( { model: leaf, callback: onCreateCallback } );
    leafDialog.render();    
  },
  
  onAddSection: function() {
    
    var callback = _.bind(function(section) {
      this.model.addSection( section );
      this.model.save(null, { success: _.bind( function() {
        this.render();
        console.log('section save success')
      },this), error: TextLab.Routes.routes.onError });
    }, this);
    
    var sectionDialog = new TextLab.SectionDialog( { model: this.model, callback: callback } );
    sectionDialog.render();    
  },
  
  onNodeSelected: function(e, data) {
    
    // if this is a leaf, activate it
    if( data.node.data.leaf ) {
      var leaf = data.node.data.leaf;
      this.mainViewport.selectLeaf(leaf);
    } else {
      // TODO if this is a section, display preview of section
      this.mainViewport.selectSection(null);
    }
  },

  generateTreeNode: function(node) {    
    var children;
    if( node.isRoot() ) {
       children = _.map( node.getChildren(), function( childNode ) {
        return this.generateTreeNode(childNode);
      }, this);
      return this.generateRootNode( node.getSection(), children );
    } else {
      if( node.isSection() ) {
        children = _.map( node.getChildren(), function( childNode ) {
          return this.generateTreeNode(childNode);
        }, this);
        return this.generateSectionNode( node.getSection(), children, node.get('position') );
      } else {
        return this.generateLeafNode( node.getLeaf(), node.get('position') );
      }
    }
  },
  
  generateLeafNode: function(leaf, position ) {
    return { 
      key: 'leaf-'+leaf.cid, 
      title: leaf.get('name'), 
      leaf: leaf, 
      position: position,
      expanded: false, 
      children: [], 
      icon: 'fa fa-file-o fa-lg' 
    };    
  },  
  
  generateSectionNode: function(section, children, position ) {
    var sortedChildren = _.sortBy(children, function( child ) { return child.position } );
		return { 
      key: 'section-'+section.cid, 
		  title: section.get('name'),
      expanded: false,
      position: position,
      children: sortedChildren,
      icon: 'fa fa-lg fa-folder'
    };
  },
  
  generateRootNode: function( section, children ) {
    var rootNode = this.generateSectionNode(section, children, 0);
    rootNode.key = "root";
    rootNode.expanded = true;
    rootNode.icon = 'fa fa-lg fa-book';
    return [ rootNode ];
  },
  
	generateTreeModel: function() {
    var rootNode = this.model.getRootNode();
    return this.generateTreeNode(rootNode);
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