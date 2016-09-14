TextLab.PrimaryEditingView = Backbone.View.extend({

	template: JST['textlab/templates/primary-editing-view'],
  
  id: 'primary-editing-view',
            	
	initialize: function(options) {
    _.bindAll( this, 'onWindowResize', 'onSplitPaneResize', 'onEditProjectSettings' );    
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
  
  onEditProjectSettings: function() {
    var onUpdateCallback = _.bind(function(doc) {
      doc.save(null, { 
        success: _.bind( function( leaf ) {  
          // TODO update section for root node if name changed
        },this),      
        error: TextLab.Routes.routes.onError 
      });
    }, this);          

    var editSettingsDialog = new TextLab.EditSettingsDialog( { model: this.model, callback: onUpdateCallback } );
    editSettingsDialog.render();    
    return false;
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
    this.xmlEditor.selectLeaf(leaf);
    this.surfaceView.selectLeaf(leaf);
  },
      
  render: function() {      
          
    this.$el.html(this.template());  
    
		this.$('div.split-pane').splitPane();
    
    this.documentTreeView = new TextLab.DocumentTreeView({ model: this.model, mainViewport: this });
    this.documentTreeView.render();
    this.$("#"+this.documentTreeView.id).replaceWith(this.documentTreeView.$el);

    // this is displayed in the document tree but handled here.
    this.$('.edit-project-button').click(this.onEditProjectSettings);

    this.xmlEditor = new TextLab.XMLEditor({ model: this.selectedLeaf });
    this.xmlEditor.render();
    this.$("#"+this.xmlEditor.id).replaceWith(this.xmlEditor.$el);
    
    this.surfaceView = new TextLab.SurfaceView({ 
      model: this.selectedLeaf, 
      xmlEditor: this.xmlEditor, 
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
    this.xmlEditor.initEditor();
    
    // for listening to events related to zones
    this.xmlEditor.setSurfaceView(this.surfaceView);
        
    // resize listeners
    $(window).resize(this.onWindowResize);
    $('div.split-pane').on('dividerdragend', this.onSplitPaneResize );
  }
  
});