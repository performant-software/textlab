TextLab.LeafImageViewer = Backbone.View.extend({

	template: JST['textlab/templates/leaf-image-viewer'],
    
  id: 'leaf-image-viewer',
  
  events: {
    'click #edit-regions-button': 'onClickEditRegions',
    'click #add-regions-button': 'onClickAddRegions',
    'click #toggle-regions-button': 'onClickToggleRegions'
  },
            	
	initialize: function(options) {
    
    _.bindAll( this, "onDrag", "onDragEnd", "onDragStart", "addRectangularRegion", "onSelectRegion" );

    this.dragStart = null;
    
    this.regions = [
      { left: 100, top: 100, right: 300, botttom: 200 }      
    ];
    
    this.tileSource = '{"type":"legacy-image-pyramid","levels":[{"url":"https://staging-uploads-juxtaeditions.s3.amazonaws.com/uploads-juxtaeditions.s3.amazonaws.com/uploads/1422303907274-3mlxforsfydjkyb9-35ecdf6c89905871192303efb67f3d16/Page2-3.jpg","width":336,"height":530},{"url":"https://staging-uploads-juxtaeditions.s3.amazonaws.com/uploads-juxtaeditions.s3.amazonaws.com/uploads/1422303907274-3mlxforsfydjkyb9-35ecdf6c89905871192303efb67f3d16/Page2-2.jpg","width":671,"height":1059},{"url":"https://staging-uploads-juxtaeditions.s3.amazonaws.com/uploads-juxtaeditions.s3.amazonaws.com/uploads/1422303907274-3mlxforsfydjkyb9-35ecdf6c89905871192303efb67f3d16/Page2-1.jpg","width":1342,"height":2117},{"url":"https://staging-uploads-juxtaeditions.s3.amazonaws.com/uploads/1422303907274-3mlxforsfydjkyb9-35ecdf6c89905871192303efb67f3d16/Page2.jpg","width":2683,"height":4234}]}';
    
  },
  
  onClickAddRegions: function() {
    // TODO put system in box drawing mode, ready to create boxes

  },
  
  onClickEditRegions: function() {
    // TODO put system in selection mode, accept clicks to select regions
  },
  
  onClickToggleRegions: function() {
    // TODO toggle the visibility of the regions
  },
  
  onSelectRegion: function() {
    // TODO if in select region mode, selects a region
  },
  
  onDragStart: function(event) {
    this.dragStart = paper.view.viewToProject(new paper.Point(event.position.x, event.position.y));
    this.viewer.setMouseNavEnabled(false);
  },
  
  onDrag: function(event) {
    if (this.dragStart) {
      var to = paper.view.viewToProject(new paper.Point(event.position.x, event.position.y));
      
      if( this.draggingRectangle ) {
        this.draggingRectangle.remove();  
      }
      
      this.draggingRectangle = this.addRectangularRegion({ 
        top: this.dragStart.y, 
        left: this.dragStart.x, 
        bottom: to.y, 
        right: to.x 
      });
      
      paper.view.draw();
    }
  },
  
  onDragEnd: function(event) {
    if (this.dragStart) {
      // TODO add this to the list of regions
      this.dragStart = null;
      this.draggingRectangle = null;
      this.viewer.setMouseNavEnabled(true);
    }
  },
      
  render: function() {        
    this.$el.html(this.template()); 
  },
  
  addRectangularRegion: function( region ) {
    var from = new paper.Point(region.left,region.top);
    var to = new paper.Point(region.right,region.bottom);
    var rect = new paper.Path.Rectangle(from, to);
    rect.strokeColor = 'red';
    rect.strokeWidth = 5;
    rect.onMouseDown = this.onSelectRegion;
    return rect;
  },
  
  initViewer: function() {      
        
		this.viewer = OpenSeadragon({
			id : "openseadragon",
			prefixUrl : "/openseadragon/",
      showFullPageControl: false,
      zoomInButton: 'zoom-in-button',
      zoomOutButton: 'zoom-out-button',
      showHomeControl: false,
      gestureSettingsMouse: {
        clickToZoom: false,
        dblClickToZoom: false,
        flickEnabled: false
      }
		});
            
    new OpenSeadragon.MouseTracker({
      element: this.viewer.canvas,
      pressHandler: this.onDragStart,
      dragHandler: this.onDrag,
      dragEndHandler: this.onDragEnd
    }).setTracking(true);
    
    this.overlay = this.viewer.paperjsOverlay();
    
    var self = this;
    var renderRegions = function(overlay, event) {      
      _.each( self.regions, self.addRectangularRegion );
      overlay.resize();
      overlay.resizecanvas();
    }.bind(null, this.overlay);
        
    this.viewer.addTiledImage({
        tileSource: this.tileSource,
        x: 0,
        y: 0,
        success: renderRegions
    });
  }
  
});