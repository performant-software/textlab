TextLab.PrimaryEditingView = Backbone.View.extend({

	template: JST['textlab/templates/primary-editing-view'],
    
  id: 'primary-editing-view',
            	
	initialize: function(options) {
    _.bindAll( this, 'onWindowResize' );
  },
  
  onWindowResize: function() {

		var editorViewport = this.$el;
    var leafImageViewerPanel = this.$("#leaf-image-viewer-panel");
    var seaDragonViewport = this.$("#openseadragon");
    var window$ = $(window);
      
		var windowHeight = window$.height();
		var editorTop = editorViewport.offset().top;
		var viewportHeight = windowHeight - editorTop;
		var viewportInnerHeight = viewportHeight;
		editorViewport.height(viewportHeight);				

		var windowWidth = window$.width();
		var editorLeft = editorViewport.offset().left;
		var viewportWidth = windowWidth - editorLeft;
		var viewportInnerWidth = viewportWidth;
		editorViewport.width(viewportWidth);				
	
		seaDragonViewport.height(leafImageViewerPanel.height());				
    seaDragonViewport.width(leafImageViewerPanel.width());	      
     
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
  
    this.leafImageViewer.renderImage();
        
    $(window).resize(this.onWindowResize);
  }
  
});