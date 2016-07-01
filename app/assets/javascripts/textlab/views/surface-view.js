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
    _.bindAll( this, "onDrag", "onDragEnd", "onDragStart", "renderZone" );
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
  
  toggleHighlight: function( zoneGroup, state ) {    
    var zoneChildren = zoneGroup.children;
    
    zoneChildren['zoneRect'].opacity = state ? 1.0 : 0.5;
    // zoneChildren['zoneRect'].dashArray = state ? null : this.dashPattern;

    zoneChildren['backdrop'].opacity = state ? 1.0 : 0.5;

    if( this.mode == 'add' ) {
      zoneChildren['resizeHandles'].visible = state;
    } else {
      zoneChildren['resizeHandles'].visible = false;      
    }
  },
  
  onDragStart: function(event) {
    this.dragStart = paper.view.viewToProject(new paper.Point(event.position.x, event.position.y));
    var hitResult = paper.project.hitTest(this.dragStart);
    
    if( !hitResult && this.selectedZoneGroup ) {
       this.toggleHighlight( this.selectedZoneGroup, false );
       this.selectedZoneGroup = null;
    }
    
    if( hitResult ) {
      var selectedItem = hitResult.item;
      var zoneGroup = this.whichZone(selectedItem);
      
      if( zoneGroup ) {        
        // if we clicked on a different zone, then select it
        if( zoneGroup != this.selectedZoneGroup ) {
          if( this.selectedZoneGroup ) {
            this.toggleHighlight( this.selectedZoneGroup, false );
          }
          this.toggleHighlight( zoneGroup, true );
          this.selectedZoneGroup = zoneGroup;
        }
      }
      
      // if we clicked on a resize handle, then we are in resize mode
      if( selectedItem.data.handle ) {
        this.dragMode = "resize-zone";
        // TODO record which drag handle we're using
      } else {
        this.dragMode = null;
      }
    } else {
      if( this.mode == 'add' ) {
        this.dragMode = "new-zone";
      }    
    }
  },
  
  whichZone: function(item) {
    
    if( !item ) {
      return null;
    }
    
    // zone groups have zone data
    if( item.data.zone ) {
      return item;
    }
    
    return this.whichZone( item.parent );
  },
  
  onDrag: function(event) {
    if ( this.mode != 'add' || !this.dragMode ) return;

    var dragAt = paper.view.viewToProject(new paper.Point(event.position.x, event.position.y));
    
    if( this.dragMode == 'new-zone' ) {
      this.dragNewZone(dragAt);
    } else if( this.dragMode == 'resize-zone' ){
      this.dragResize(dragAt);
    }    

    paper.view.draw();    
  },
  
  dragNewZone: function(dragAt) {
    var zoneRect = { 
        ulx: this.dragStart.x, 
        uly: this.dragStart.y, 
        lrx: dragAt.x, 
        lry: dragAt.y 
    };
    
    var zone;
    if( !this.selectedZoneGroup ) {
      zone = new TextLab.Zone(zoneRect);
      this.model.zones.addZone(zone);      
    } else {
      zone = this.selectedZoneGroup.data.zone;
      zone.set(zoneRect);
      this.selectedZoneGroup.remove();  
    }
    this.selectedZoneGroup = this.renderZone(zone);      
  },  
    
  dragResize: function(dragAt) {    
    var zone = this.selectedZoneGroup.data.zone;    
    zone.set({ uly: dragAt.y });    
    this.selectedZoneGroup.remove();  
    this.selectedZoneGroup = this.renderZone(zone);   
    this.selectedZoneGroup.children['resizeHandles'].visible = true;
  },  
  
  onDragEnd: function(event) {
    this.dragStart = null;
    this.dragMode = null;
  },
      
  render: function() {        
    this.$el.html(this.template()); 
  },
  
  renderZone: function( zone ) {   
    
    // render zone rectangle
    var from = new paper.Point(zone.get("ulx"),zone.get("uly"));
    var to = new paper.Point(zone.get("lrx"),zone.get("lry"));
    var zoneItem = new paper.Path.Rectangle(from, to);
    var zoneBounds = zoneItem.bounds;

    zoneItem.strokeColor = 'blue';
    zoneItem.strokeWidth = 12;
    zoneItem.dashArray = this.dashPattern;
    zoneItem.name = 'zoneRect';    
    
    // zone id label
    var labelPosition = new paper.Point(zoneBounds.right - 120, zoneBounds.bottom - 25 );   
    var text = new paper.PointText(labelPosition);
    text.fontSize = 48;
    text.fillColor = 'white';
    text.content = zone.zoneIDLabel ? zone.zoneIDLabel : '';
    text.name = "zoneID";

    // backdrop behind label
    var backdrop = new paper.Path.Rectangle(text.bounds);
    backdrop.fillColor = 'blue';
    backdrop.name = 'backdrop';
    
    // resize handles
    var topHandle = new paper.Path.Circle(zoneBounds.topCenter, 30);
    topHandle.fillColor = 'blue';
    topHandle.data.handle = ['uly'];
    var leftHandle = new paper.Path.Circle(zoneBounds.leftCenter, 30);
    leftHandle.fillColor = 'blue';
    leftHandle.data.handle = ['uly'];
    var rightHandle = new paper.Path.Circle(zoneBounds.rightCenter, 30);
    rightHandle.fillColor = 'blue';
    rightHandle.data.handle = ['uly'];
    var bottomHandle = new paper.Path.Circle(zoneBounds.bottomCenter, 30);
    bottomHandle.fillColor = 'blue';
    bottomHandle.data.handle = ['uly'];
    var resizeHandles = new paper.Group([topHandle,leftHandle,rightHandle,bottomHandle]);
    resizeHandles.name = 'resizeHandles';    
    resizeHandles.visible = false;

    // zone group
    var zoneGroup = new paper.Group([zoneItem, resizeHandles, backdrop, text ]);
    zoneGroup.data.zone = zone;  
    
    return zoneGroup;
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
      _.each( self.model.zones, self.renderZone );
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