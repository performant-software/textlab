TextLab.LeafViewer = Backbone.View.extend({
      
  id: 'leaf-viewer',
  
  dashPattern: [50, 10],
  unSelectedOpacity: 0.25,
  
  render: function() {
    var diplomaticPanel = new TextLab.DiplomaticPanel({ el: this.$('#diplomatic-panel') } );
    diplomaticPanel.render();
    this.initViewer();
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

    var zoneLinks = [];

    zoneItem.strokeColor = 'blue';
    zoneItem.strokeWidth = 12;
    if( zoneLinks.length == 0 ) {
      zoneItem.dashArray = this.dashPattern;
    }
    zoneItem.opacity = this.unSelectedOpacity;
    zoneItem.name = 'zoneRect';

    // zone id label
    var labelPosition = new paper.Point(zoneBounds.right - 120, zoneBounds.bottom - 25 );
    var text = new paper.PointText(labelPosition);
    text.fontSize = 48;
    text.fillColor = 'white';
    var zoneLabel = zone.zone_label;
    text.content = zoneLabel ? zoneLabel : '';
    text.name = "zoneID";

    // backdrop behind label
    var backdrop = new paper.Path.Rectangle(text.bounds);
    backdrop.fillColor = 'blue';
    backdrop.opacity = this.unSelectedOpacity;
    backdrop.name = 'backdrop';

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
    var zoneGroup = new paper.Group([zoneItem, resizeHandles, deleteButton, backdrop, text ]);
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




