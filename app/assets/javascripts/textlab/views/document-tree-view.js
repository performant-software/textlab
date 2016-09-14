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
    'click .add-section-button' : 'onAddSection',  
    'click .edit-settings-button' : 'onEditProjectSettings'    
  },
              	
	initialize: function(options) {
    this.mainViewport = options.mainViewport;
    _.bindAll( this, "onNodeSelected" );
  },
  
  insertAt: function() {
    var selectedNode = this.getSelectedNode();

    if( selectedNode.isSection() ) {
      // if adding to a section, add at end
      var children = selectedNode.getChildren();
      return { parent: selectedNode, position: children.length };
    } else {
      // otherwise, add before the selected node
      return { parent: selectedNode.getParent(), position: selectedNode.get('position') };
    }
  },
  
  addDocumentNode: function( documentNode ) { 
 
    var insertAt = documentNode.get('position');
    var parentNode = this.model.documentNodes.findWhere({id: documentNode.get('document_node_id') });
    var children = _.sortBy( parentNode.getChildren(), function(child) { return child.get('position') } );
    var step = insertAt + 1;
    
    // re-order the sibliings as necessary
    _.each( children, function( child ) {
      if( child.get('position') >= insertAt ) {
        child.set('position', step );
        step = step + 1;
      }        
    });
    
    // server version in DocumentNode.rb
    //
    //   insert_at = document_node.position
    //   children = self.parent_node.child_nodes.order(:position)
    //   step = insert_at + 1
    //   children.each do |child|
    //     if child.position >= insert_at
    //       child.position = step
    //       step = step + 1
    //       child.save
    //     end
    //   end
      
    var onSuccess = _.bind( function() {
       this.render();
      console.log('update tree success')      
    }, this);

    this.model.documentNodes.add( documentNode );
    documentNode.save( null, { success: onSuccess, error: TextLab.Routes.routes.onError });
  },
  
  deleteLeafNode: function( leaf ) {
    var documentNodes = this.model.documentNodes;
    var leafNode = documentNodes.findWhere({ leaf_id: leaf.id });
    documentNodes.remove( leafNode );
    this.render();
  },
  
  onAddLeaf: function() {
    var onCreateCallback = _.bind(function(leaf) {
      this.model.addLeaf(leaf);
      leaf.save(null, { 
        success: _.bind( function( leaf ) {  
          var insertPoint = this.insertAt();
          var leafNode = new TextLab.DocumentNode({ 
            document_node_id: insertPoint.parent.id, 
            position: insertPoint.position,
            leaf_id: leaf.id, 
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
    var onCreateCallback = _.bind(function(section) {
      this.model.addSection(section);
      section.save(null, { 
        success: _.bind( function( section ) {  
          var insertPoint = this.insertAt();
          var sectionNode = new TextLab.DocumentNode({ 
            document_node_id: insertPoint.parent.id, 
            position: insertPoint.position,
            document_section_id: section.id, 
            document_id: this.model.id  
          });
          this.addDocumentNode(sectionNode);
        },this),      
        error: TextLab.Routes.routes.onError 
      });
    }, this);  
    
    var section = new TextLab.DocumentSection();
    var sectionDialog = new TextLab.SectionDialog( { model: section, callback: onCreateCallback } );
    sectionDialog.render();    
  },
  
  onEditProjectSettings: function() {
    var onUpdateCallback = _.bind(function(doc) {
      doc.save(null, { 
        success: _.bind( function() {  
          var docName = doc.get('name');
          var rootNode = doc.getRootNode();
          var rootSection = rootNode.getSection();
          var currentName = rootSection.get('name');
          // update section for root node if name changed
          if( currentName != docName ) {
            rootSection.set('name', docName);
            rootSection.save( null, { success: _.bind( function() {
              this.render();
            }, this), 
            error: TextLab.Routes.routes.onError } );
          }
        },this),      
        error: TextLab.Routes.routes.onError 
      });
    }, this);          

    var editSettingsDialog = new TextLab.EditSettingsDialog( { model: this.model, callback: onUpdateCallback } );
    editSettingsDialog.render();    
    return false;
  },
    
  onNodeSelected: function(e, data) {    
    var docNode = data.node.data.docNode;
    
    if( docNode.isLeaf() ) {
      var leaf = docNode.getLeaf();
      this.mainViewport.selectLeaf(leaf);
    } else {
      var section = docNode.getSection();
      this.mainViewport.selectSection(section);
    }
  },
  
  getSelectedNode: function() {
    var treeNode = this.fancyTree.getActiveNode();
    return ( treeNode ) ? treeNode.data.docNode : this.model.getRootNode(); 
  },

  generateTreeNode: function(node) {    
    var children;
    if( node.isRoot() ) {
       children = _.map( node.getChildren(), function( childNode ) {
        return this.generateTreeNode(childNode);
      }, this);
      return this.generateRootNode( node, children );
    } else {
      if( node.isSection() ) {
        children = _.map( node.getChildren(), function( childNode ) {
          return this.generateTreeNode(childNode);
        }, this);
        return this.generateSectionNode( node, children );
      } else {
        return this.generateLeafNode( node );
      }
    }
  },
  
  generateLeafNode: function(documentNode) {
    var leaf = documentNode.getLeaf();
    return { 
      key: documentNode.id, 
      title: leaf.get('name'), 
      docNode: documentNode, 
      children: [], 
      icon: 'fa fa-file-o fa-lg' 
    };    
  },  
  
  generateSectionNode: function( documentNode, children ) {
    var section = documentNode.getSection();
    var sortedChildren = _.sortBy(children, function( child ) { return child.docNode.get('position') } );
		return { 
      key: documentNode.id, 
		  title: section.get('name'),
      docNode: documentNode, 
      expanded: true,
      children: sortedChildren,
      icon: 'fa fa-lg fa-folder'
    };
  },
  
  generateRootNode: function( documentNode, children ) {
    var rootNode = this.generateSectionNode(documentNode, children);
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
  }
  
});