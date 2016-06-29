TextLab.SurfaceView = Backbone.View.extend({

	template: JST['textlab/templates/surface-view'],
    
  id: 'surface-view',
  
  events: {
    'click #add-mode-button': 'addMode',
    'click #nav-mode-button': 'navMode',
    'click #toggle-zones-button': 'toggleZones'
  },
  
  dashPattern: [50, 10],
            	
	initialize: function(options) {
    _.bindAll( this, "onDrag", "onDragEnd", "onDragStart", "renderZone", "selectZone", "onClick" );
    this.dragStart = null;
  },
  
  addMode: function() {
    this.mode = 'add';
    this.viewer.setMouseNavEnabled(false);
    
    // if there's a selected zone, make handles visible
    if( this.selectedZoneGroup ) {
      this.toggleHighlight( this.selectedZoneGroup, true );
    } 
    
    $('#add-mode-button').addClass('active');
    $('#nav-mode-button').removeClass('active');
  },
    
  navMode: function() {
    this.mode = 'nav';
    this.viewer.setMouseNavEnabled(true);
    
    // if there's a selected zone, make handles hide
    if( this.selectedZoneGroup ) {
      this.toggleHighlight( this.selectedZoneGroup, false );
    } 
    
    $('#nav-mode-button').addClass('active');
    $('#add-mode-button').removeClass('active');
  },
  
  toggleZones: function() {
    // TODO toggle the visibility of the regions
  },
  
  selectZone: function(event) {
    if( this.selectedZoneGroup ) {
      this.toggleHighlight( this.selectedZoneGroup, false );
    } 
    
    this.selectedZoneGroup = event.target.parent;
    this.toggleHighlight( this.selectedZoneGroup, true );
  },
  
  toggleHighlight: function( zoneGroup, state ) {
    
    // dim or highlight zone
    _.each( zoneGroup.children, function(child) {
      child.opacity = state ? 1 : 0.5;
    });

    zoneGroup.children['zoneRect'].dashArray = state ? null: this.dashPattern;

    if( this.mode == 'add' ) {
      zoneGroup.children['resizeHandles'].visible = state;
    } else {
      zoneGroup.children['resizeHandles'].visible = false;      
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
      
      if( this.draggingZone ) {
        this.draggingZone.remove();  
      }
      
      this.draggingZone = this.renderZone({ 
        uly: this.dragStart.y, 
        ulx: this.dragStart.x, 
        lry: to.y, 
        lrx: to.x 
      });
      
      paper.view.draw();
    }
  },
  
  onDragEnd: function(event) {
    if ( this.mode == 'add' ) {
      var zone = this.model.zones.addZone(this.draggingZone.bounds);
      this.renderZoneID(this.draggingZone, zone);
      paper.view.draw();
    } 
    
    this.dragStart = null;
    this.draggingZone = null;
  },
  
  onClick: function(event) {
    
    // if nothing is selected, deselect the selected group
    if( this.selectedZoneGroup ) {
      var hitAt = paper.view.viewToProject(new paper.Point(event.position.x, event.position.y));
      if( !paper.project.hitTest(hitAt) ) this.toggleHighlight( this.selectedZoneGroup, false );
    }
    
  },
      
  render: function() {        
    this.$el.html(this.template()); 
  },
  
  renderZoneID: function( zoneItem, zone ) {
    var zoneBounds = zoneItem.bounds;
    var labelPosition = new paper.Point(zoneBounds.right - 120, zoneBounds.bottom - 25 ); 
    
    var text = new paper.PointText(labelPosition);
    text.fontSize = 48;
    text.fillColor = 'white';
    text.content = zone.zoneIDLabel;
    text.opacity = 0.5;

    var backdrop = new paper.Path.Rectangle(text.bounds);
    backdrop.fillColor = 'blue';
    backdrop.sendToBack();
    backdrop.opacity = 0.5;
    
    // render resize handle
    var topHandle = new paper.Path.Circle(zoneBounds.topCenter, 30);
    topHandle.fillColor = 'blue';
    var leftHandle = new paper.Path.Circle(zoneBounds.leftCenter, 30);
    leftHandle.fillColor = 'blue';
    var rightHandle = new paper.Path.Circle(zoneBounds.rightCenter, 30);
    rightHandle.fillColor = 'blue';
    var bottomHandle = new paper.Path.Circle(zoneBounds.bottomCenter, 30);
    bottomHandle.fillColor = 'blue';
    var resizeHandles = new paper.Group([topHandle,leftHandle,rightHandle,bottomHandle]);
    resizeHandles.name = 'resizeHandles';    
    resizeHandles.visible = false;

    zoneItem.name = 'zoneRect';    
    var zoneGroup = new paper.Group([backdrop,zoneItem,resizeHandles,text]);
    zoneGroup.onMouseDown = this.selectZone;
  },

  renderZone: function( zone ) {
    var from = new paper.Point(zone.ulx,zone.uly);
    var to = new paper.Point(zone.lrx,zone.lry);
    var rect = new paper.Path.Rectangle(from, to);
    rect.strokeColor = 'blue';
    rect.opacity = 0.5;
    rect.strokeWidth = 12;
    rect.dashArray = this.dashPattern;
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
      dragEndHandler: this.onDragEnd,
      clickHandler: this.onClick
    }).setTracking(true);
    
    this.overlay = this.viewer.paperjsOverlay();
    
    var self = this;
    var renderRegions = function(overlay, event) {      
      _.each( self.model.zones.toJSON(), self.renderZone );
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