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
		documentTree.height(documentTreePanel.height() - documentToolbar.height());				
    documentTree.width(documentTreePanel.width());	
    
    var xmlEditorPanel = this.$("#xml-editor-panel");
    var xmlEditorToolbar = this.$(".xml-editor-toolbar");
    this.xmlEditor.editor.setSize( xmlEditorPanel.width(), xmlEditorPanel.height() - xmlEditorToolbar.height() - 15 );
    
    // tell open sea dragon overlay to resize
    var overlay = this.surfaceView.overlay;    
    if( overlay ) {
      overlay.resize();
      overlay.resizecanvas();     
    } 
  },
    
  selectSection: function( section ) {
    // need to hide split view and show the explorer view
    this.$('.editor-view').hide();
    this.documentExplorer.selectSection( section );
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

    this.tabbedEditor = new TextLab.TabbedEditor({ model: this.selectedLeaf });
    this.tabbedEditor.render();
    this.$("#"+this.tabbedEditor.id).replaceWith(this.tabbedEditor.$el);
    
    this.surfaceView = new TextLab.SurfaceView({ 
      model: this.selectedLeaf, 
      xmlEditor: this.tabbedEditor.xmlEditor, 
      documentTree: this.documentTreeView,
      mainViewport: this });
    this.surfaceView.render();    
    this.$("#"+this.surfaceView.id).replaceWith(this.surfaceView.$el);   
    
    this.documentExplorer = new TextLab.DocumentExplorer({ model: this.model, section: null });
    this.documentExplorer.render();
    this.$("#"+this.documentExplorer.id).replaceWith(this.documentExplorer.$el);   
    
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