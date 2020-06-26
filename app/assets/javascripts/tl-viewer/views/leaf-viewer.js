TextLab.LeafViewer = Backbone.View.extend({
      
  id: 'leaf-viewer',
  
  events: {
    "click .tab-button": 'onSelectTab'
  },
      
  initialize: function() {
    this.mouseOverEnabled = true;
    _.bindAll(this,'onMouseOverRevision', 'onMouseOutRevision');
  },
  
  render: function() {
    var diplomaticPanel = new TextLab.DiplomaticPanel({ el: this.$('#diplomatic-panel') } );
    diplomaticPanel.render();

    var basePanel = new TextLab.BasePanel({ el: this.$('#base-panel') } );
    basePanel.render();

    if( this.model.sequences && this.model.sequences.length > 0 ) {
      var sequenceListPanel = new TextLab.SequenceListPanel({ 
        el: this.$('#sequence-list-panel'),
        sequences: this.model.sequences, 
        leafViewer: this
      });
      sequenceListPanel.render();      
    }
    
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
    
    this.displayTabPane( 'diplo-pane' );    
  },
  
  onSelectTab: function(event) {
    // var currentTab = this.$('.active');
    var targetTab = $(event.currentTarget);
    var tabTargetID = targetTab.attr("data-tab");
    targetTab.tab('show');
    this.displayTabPane( tabTargetID );    
  },
    
  displayTabPane: function( tabID ) {    
    this.$(".tab-pane").hide();
    this.$("#"+tabID).show();
  },

  highlightZone: function( zoneLabel, state ) {
    // go through the items until we find the zone group for this zone
    var zoneGroup = _.find( paper.project.activeLayer.children, function(item) {
      return (item.data.zone && item.data.zone.zone_label == zoneLabel );
    });
    
    zoneGroup.visible = state;
    paper.view.draw(); 
  },
  
  onMouseOverRevision: function( zoneLabel ) {
    if( this.mouseOverEnabled ) {
      var zone_obj = this.model.zone_hash[zoneLabel];
      console.log(zone_obj);
      var innerhtml = "";
      if(zone_obj.place) {
        var place = zone_obj.place;
        innerhtml = innerhtml + "<p><b>Place: </b>";
        innerhtml = innerhtml +  place + "</p>";
      };
      if(zone_obj.hand) {
        var hand = zone_obj.hand;
        innerhtml = innerhtml + "<p><b> Hand: </b>";
        innerhtml = innerhtml +  hand + "</p>";
      };
      if(zone_obj.facs) {
        var facs = zone_obj.facs;
        innerhtml = innerhtml + "<p><b> Facs: </b>";
        innerhtml = innerhtml +  facs + "</p>";
      };
      if(zone_obj["function"]) {
        var funct = zone_obj["function"];
        innerhtml = innerhtml + "<p><b> Function: </b>";
        innerhtml = innerhtml +  funct + "</p>";
      };
      if(zone_obj.rend) {
        var rend = zone_obj.rend;
        innerhtml = innerhtml + "<p><b> Rend: </b>";
        innerhtml = innerhtml +  rend + "</p>";
      };
      if(zone_obj.change) {
        var change = zone_obj.change;
        innerhtml = innerhtml + "<p><b> Change: </b>";
        innerhtml = innerhtml +  change + "</p>";
      };
      this.highlightZone(zoneLabel,true);
      document.getElementById("zone_atts").innerHTML = innerhtml;
      this.$("#zone_atts").show();
    }
  },
  
  onMouseOutRevision: function( zoneLabel ) {
    if( this.mouseOverEnabled ) {
      this.highlightZone(zoneLabel,false);
      document.getElementById("zone_atts").innerHTML = "";
      this.$("#zone_atts").hide();
    }
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
    zoneGroup.visible = false;
    
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




