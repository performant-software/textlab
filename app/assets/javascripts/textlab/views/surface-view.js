TextLab.SurfaceView = Backbone.View.extend({

	template: JST['textlab/templates/surface-view'],
    
  id: 'surface-view',
  
  events: {
    'click #add-mode-button': 'addMode',
    'click #nav-mode-button': 'navMode',
    'click #toggle-zones-button': 'toggleZones'
  },
            	
	initialize: function(options) {
    _.bindAll( this, "onDrag", "onDragEnd", "onDragStart", "addZone", "selectZone" );
    this.dragStart = null;
  },
  
  addMode: function() {
    this.mode = 'add';
    this.viewer.setMouseNavEnabled(false);
    $('#add-mode-button').addClass('active');
    $('#nav-mode-button').removeClass('active');
  },
    
  navMode: function() {
    this.mode = 'nav';
    this.viewer.setMouseNavEnabled(true);
    $('#nav-mode-button').addClass('active');
    $('#add-mode-button').removeClass('active');
  },
  
  toggleZones: function() {
    // TODO toggle the visibility of the regions
  },
  
  selectZone: function(event) {
    if( this.mode == 'nav' ) {
      var hitResult = paper.project.hitTest(event.point);
      var rect = hitResult.item;
      rect.opacity = 1;
      rect.dashArray = [];
    }
  },
  
  onDragStart: function(event) {
    if( this.mode == 'add' ) {
      this.dragStart = paper.view.viewToProject(new paper.Point(event.position.x, event.position.y));
    }
  },
  
  onDrag: function(event) {
    if ( this.mode == 'add' ) {
      var to = paper.view.viewToProject(new paper.Point(event.position.x, event.position.y));
      
      if( this.draggingRectangle ) {
        this.draggingRectangle.remove();  
      }
      
      this.draggingRectangle = this.addZone({ 
        top: this.dragStart.y, 
        left: this.dragStart.x, 
        bottom: to.y, 
        right: to.x 
      });
      
      paper.view.draw();
    }
  },
  
  onDragEnd: function(event) {
    if ( this.mode == 'add' ) {
      // TODO add this to the list of zones 
    } 
    
    this.dragStart = null;
    this.draggingRectangle = null;
  },
      
  render: function() {        
    this.$el.html(this.template()); 
  },
  
  addZone: function( zone ) {
    var from = new paper.Point(zone.left,zone.top);
    var to = new paper.Point(zone.right,zone.bottom);
    var rect = new paper.Path.Rectangle(from, to);
    rect.strokeColor = 'blue';
    rect.opacity = 0.5;
    rect.strokeWidth = 12;
    rect.dashArray = [50, 10];
    rect.onMouseDown = this.selectZone;
    return rect;
  },
  
  initViewer: function() {      
        
		this.viewer = OpenSeadragon({
			id : "openseadragon",
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
      _.each( self.model.zones.toJSON(), self.addZone );
      overlay.resize();
      overlay.resizecanvas();
    }.bind(null, this.overlay);
        
    this.viewer.addTiledImage({
        tileSource: this.model.tileSource,
        success: renderRegions
    });
    
    this.navMode();
  }
  
});