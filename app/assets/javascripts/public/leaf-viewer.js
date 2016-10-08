TextLab.LeafViewer = Backbone.View.extend({
      
  id: 'leaf-viewer',
  
  dashPattern: [50, 10],
  unSelectedOpacity: 0.25,
  
  initialize: function() {
    _.bindAll(this,'onMouseOverRevision', 'onMouseOutRevision');
  },
  
  render: function() {
    var diplomaticPanel = new TextLab.DiplomaticPanel({ el: this.$('#diplomatic-panel') } );
    diplomaticPanel.render();
    this.initViewer();
    
    // set up mouse enter handlers for all the revision sites 
    var spans = diplomaticPanel.$('span');
    _.each(spans, function(span) {
      var $span = $(span);
      var facs = $span.attr('facs');
      if( facs ) {
        // zone label is last 4 chars 
        var zoneLabel = facs.slice( facs.length-4 );
        $span.mouseenter( _.partial( this.onMouseOverRevision, zoneLabel ) );
        $span.mouseleave( _.partial( this.onMouseOutRevision, zoneLabel ) );
      }
    },this);    
    
  },
  
  onMouseOverRevision: function( zoneLabel ) {
        
    // go through the items until we find the zone group for this zone
    var zoneGroup = _.find( paper.project.activeLayer.children, function(item) {
      return (item.data.zone && item.data.zone.zone_label == zoneLabel );
    });
       
    var zoneChildren = zoneGroup.children;
    
    if( !zoneGroup.visible && state ) {
      zoneGroup.visible = true;
    }
    
    zoneChildren['zoneRect'].opacity = 1.0

    paper.view.draw(); 
  },
  
  onMouseOutRevision: function( zoneLabel ) {
    // go through the items until we find the zone group for this zone
    var zoneGroup = _.find( paper.project.activeLayer.children, function(item) {
      return (item.data.zone && item.data.zone.zone_label == zoneLabel );
    });
       
    var zoneChildren = zoneGroup.children;
    
    if( !zoneGroup.visible && state ) {
      zoneGroup.visible = true;
    }
    
    zoneChildren['zoneRect'].opacity = this.unSelectedOpacity;

    paper.view.draw(); 
    
  },
  
  getTileSource: function( callback ) {
    
    // if blank, don't try to GET it.
    if( !this.model.tile_source ) {
      callback(null);
      return;
    }
    
    var infoURLTemplate = _.template("<%= tileSource %>/info.json");
    
    $.ajax({
      url: infoURLTemplate( { tileSource: this.model.tile_source }),
      dataType: 'json',
      success: function( obj ) {
        callback( new OpenSeadragon.IIIFTileSource(obj) );
      }
    }); 
  },
  
  renderZone: function( zone ) {   

    // render zone rectangle
    var from = new paper.Point(zone.ulx,zone.uly);
    var to = new paper.Point(zone.lrx,zone.lry);
    var zoneItem = new paper.Path.Rectangle(from, to);
    var zoneBounds = zoneItem.bounds;

    zoneItem.strokeColor = 'blue';
    zoneItem.strokeWidth = 12;
    zoneItem.opacity = this.unSelectedOpacity;
    zoneItem.name = 'zoneRect';


    // resize handles
    var topHandle = new paper.Path.Circle(zoneBounds.topCenter, 30);
    topHandle.fillColor = 'blue';
    topHandle.data.handle = 'top';
    var leftHandle = new paper.Path.Circle(zoneBounds.leftCenter, 30);
    leftHandle.fillColor = 'blue';
    leftHandle.data.handle = 'left';
    var rightHandle = new paper.Path.Circle(zoneBounds.rightCenter, 30);
    rightHandle.fillColor = 'blue';
    rightHandle.data.handle = 'right';
    var bottomHandle = new paper.Path.Circle(zoneBounds.bottomCenter, 30);
    bottomHandle.fillColor = 'blue';
    bottomHandle.data.handle = 'bottom';
    var resizeHandles = new paper.Group([topHandle,leftHandle,rightHandle,bottomHandle]);
    resizeHandles.name = 'resizeHandles';
    resizeHandles.visible = false;

    // delete button
    var deleteButton = new paper.Path.Circle(zoneBounds.topRight, 30);
    deleteButton.fillColor = 'red';
    deleteButton.name = 'deleteButton';
    deleteButton.visible = false;
    deleteButton.data.deleteButton = true;

    // zone group
    var zoneGroup = new paper.Group([zoneItem, resizeHandles, deleteButton ]);
    zoneGroup.zoneGroup = true;
    zoneGroup.data.zone = zone;

    return zoneGroup;
  },
  
  initViewer: function() {      
            
		this.viewer = OpenSeadragon({
			id : "openseadragon",
      showFullPageControl: false,
      showHomeControl: false,
      showZoomControl: false
		});
                    
    this.overlay = this.viewer.paperjsOverlay();
        
    var renderZones = _.bind( function() {
      _.each( this.model.zones, this.renderZone, this );
      this.overlay.resize();
      this.overlay.resizecanvas();
      this.viewReady = true;
    }, this );

    this.getTileSource(_.bind( function(tileSource) {
      if( tileSource ) {
        this.viewer.addTiledImage({
          tileSource: tileSource,
          success: renderZones
        });
      }
    }, this));

  }
  
});




