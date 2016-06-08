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
    var leafImageViewerPanel = this.$("#leaf-image-viewer-panel");
    var seaDragonViewport = this.$("#openseadragon");
		seaDragonViewport.height(leafImageViewerPanel.height());				
    seaDragonViewport.width(leafImageViewerPanel.width());	
    
    var xmlEditorPanel = this.$("#xml-editor-panel");
    this.xmlEditor.editor.setSize( xmlEditorPanel.width(), xmlEditorPanel.height() );
    
    // tell open sea dragon overlay to resize
    var overlay = this.leafImageViewer.overlay;     
    overlay.resize();
    overlay.resizecanvas();     
  },
      
  render: function() {      
    
    this.$el.html(this.template({}));  

		this.$('div.split-pane').splitPane();
    
    this.documentTreeView = new TextLab.DocumentTreeView();
    this.documentTreeView.render();
    this.$("#"+this.documentTreeView.id).replaceWith(this.documentTreeView.$el);
    
    this.leafImageViewer = new TextLab.LeafImageViewer();
    this.leafImageViewer.render();    
    this.$("#"+this.leafImageViewer.id).replaceWith(this.leafImageViewer.$el);
   
    this.xmlEditor = new TextLab.XMLEditor();
    this.xmlEditor.render();
    this.$("#"+this.xmlEditor.id).replaceWith(this.xmlEditor.$el);

    $(".textlab-app").html(this.$el);                
  
    // viewer and editor must be initialized after they are in the DOM
    this.leafImageViewer.initViewer();
    this.xmlEditor.initEditor();
        
    // resize listeners
    $(window).resize(this.onWindowResize);
    $('div.split-pane').on('dividerdragend', this.onSplitPaneResize );
    
  }
  
});