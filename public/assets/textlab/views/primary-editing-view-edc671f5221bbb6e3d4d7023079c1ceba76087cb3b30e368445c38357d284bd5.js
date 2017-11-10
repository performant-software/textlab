TextLab.PrimaryEditingView = Backbone.View.extend({

	template: JST['textlab/templates/primary-editing-view'],
  
  id: 'primary-editing-view',
            	
	initialize: function(options) {
    _.bindAll( this, 'onWindowResize', 'onSplitPaneResize' );    
  },
  
  onWindowResize: function() {
    var window$ = $(window);      
		var windowHeight = window$.height();
		var windowWidth = window$.width();

		var editorTop = this.$el.offset().top;
		var editorLeft = this.$el.offset().left;

		var viewportHeight = windowHeight - editorTop;
		var viewportWidth = windowWidth - editorLeft;

    // resize editing view to take up whole window
		this.$el.height(viewportHeight);				
		this.$el.width(viewportWidth);	
    
    this.onSplitPaneResize();				
	},
  
  onSplitPaneResize: function() {    
    
    // resize the leaf image viewport
    var surfaceViewPanel = this.$("#surface-view-panel");
    var seaDragonViewport = this.$("#openseadragon");
		seaDragonViewport.height(surfaceViewPanel.height());				
    seaDragonViewport.width(surfaceViewPanel.width());	

    var documentTreePanel = this.$("#document-tree-panel");
    var documentTree = this.$("#document-tree");
    var documentToolbar = this.$("#document-toolbar");
		documentTree.height(documentTreePanel.height() - documentToolbar.height() - 25);				
    documentTree.width(documentTreePanel.width());	

    var explorerView = this.$("#explorer-view");
    var documentExplorer = this.$("#document-explorer");
    documentExplorer.height(explorerView.height());
    documentExplorer.width(explorerView.width());
    
    this.tabbedEditor.resizeActivePanel();
    
    // tell open sea dragon overlay to resize
    if( this.surfaceView.viewReady ) {
      var overlay = this.surfaceView.overlay;    
      overlay.resize();
      overlay.resizecanvas();     
    } 
  },

  onDocumentTreeChanged: function() {
    this.documentExplorer.render();
  },

  onConfigChanged: function(config) {
    if( this.tabbedEditor ) {
      this.tabbedEditor.onConfigChanged(config);
    }
  },
    
  selectSection: function( sectionNode ) {

    var node = ( sectionNode == null ) ? this.model.getRootNode() : sectionNode;

    // need to hide split view and show the explorer view
    this.$('.editor-view').hide();
    this.documentExplorer.selectSection( node );
    this.$('.explorer-view').show();
  },
  
  selectLeaf: function(leaf) {
    this.$('.explorer-view').hide();
    this.$('.editor-view').show();
    this.selectedLeaf = leaf;
    this.tabbedEditor.selectLeaf(leaf);
    this.surfaceView.selectLeaf(leaf);
  },
      
  render: function() {      
          
    this.$el.html(this.template());  
    
		this.$('div.split-pane').splitPane();
    
    this.documentTreeView = new TextLab.DocumentTreeView({ model: this.model, mainViewport: this });
    this.documentTreeView.render();
    this.$("#"+this.documentTreeView.id).replaceWith(this.documentTreeView.$el);

    if( !this.selectedLeaf ) {
      this.selectedLeaf = _.first( this.model.leafs.models );
    }

    var xmlEditorPanel = this.$("#xml-editor-panel");
    this.tabbedEditor = new TextLab.TabbedEditor({ 
      model: this.selectedLeaf, 
      config: this.model.config, 
      parentPanel: xmlEditorPanel, 
      projectOwner: this.model.get('owner') 
    });
    this.tabbedEditor.render();
    this.$("#"+this.tabbedEditor.id).replaceWith(this.tabbedEditor.$el);
    
    this.surfaceView = new TextLab.SurfaceView({ 
      model: this.selectedLeaf, 
      owner: this.model.get('owner'),
      tabbedEditor: this.tabbedEditor, 
      documentTree: this.documentTreeView,
      mainViewport: this });
    this.surfaceView.render();    
    this.$("#"+this.surfaceView.id).replaceWith(this.surfaceView.$el);   
    
    this.documentExplorer = new TextLab.DocumentExplorer({ model: this.model, 
      mainViewport: this, 
      documentTree: this.documentTreeView 
    });
    this.documentExplorer.render();
    var documentExplorerEl = this.$("#"+this.documentExplorer.id);
    documentExplorerEl.replaceWith(this.documentExplorer.$el);   
  },
    
  postRender: function() {
    // viewer and editor must be initialized after they are in the DOM
    this.surfaceView.initViewer();
    this.tabbedEditor.postRender(this.surfaceView);
        
    // resize listeners
    $(window).resize(this.onWindowResize);
    $('div.split-pane').on('dividerdragend', this.onSplitPaneResize );
  }
  
});
