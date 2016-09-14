TextLab.Leaf = Backbone.Model.extend({
  urlRoot: "leafs",
  
  // TODO has a tile source url, a collection of zones, xml, sequences, parent, order #
  
  initialize: function( attributes, options ) {
    this.afterLoad( attributes );
  },
  
  afterLoad: function( attributes ) {
    if( attributes && attributes["zones"] ) {
      this.zones = new TextLab.ZoneCollection(attributes["zones"]);
    } else {
      this.zones = new TextLab.ZoneCollection();
    }
    
    if( attributes && attributes["zone_links"] ) {
      this.zoneLinks = new TextLab.ZoneLinkCollection(attributes["zone_links"]);
    } else {
      this.zoneLinks = new TextLab.ZoneLinkCollection();
    }
  },
  
  beforeSave: function() {
    var zoneLinksObj = this.zoneLinks.toJSON();
    this.set( 'zone_links_json', zoneLinksObj );
  },
  
  sync: function(method, model, options) {
    
    // add hook for afterLoad event that does something after the model has been loaded
    if( this.afterLoad && (method == 'read' || method == 'create') ) {    
      if( options.success ) {
        var originalCallback = options.success;
        options.success = _.bind( function( attributes ) { 
          this.afterLoad( attributes );
          originalCallback( attributes );
        }, this);
      } else {
        options.success = _.bind( this.afterLoad, this );
      }      
    }
    
    if( this.beforeSave && method == 'update' ) {    
      this.beforeSave();
    }
    
    Backbone.sync(method, model, options);
  },
  
  addZone: function( zone ) {
    var zoneID = this.get("next_zone_label")
    this.set("next_zone_label", zoneID+1);
    zone.set("leaf_id", this.id );
    zone.generateZoneLabel(zoneID);
    this.zones.add( zone );
  },
  
  addZoneLink: function( zoneLink ) {
    zoneLink.set("leaf_id", this.id );
    this.zoneLinks.add( zoneLink );
  },    
  
  isZoneLinkBroken: function( zoneLink ) {
    var zone = _.find( this.zones.models, function( zone ) {
      return zone.get("zone_label") == zoneLink.get("zone_label");
    });
    
    return zone == null;
  },
  
  getZoneLinks: function( zone ) {    
    var links = [];
    _.each( this.zoneLinks.models, function( zoneLink ) {
      if( zoneLink.get('zone_label') == zone.get('zone_label') ) {
        links.push( zoneLink );
      }      
    } );
    
    return links;    
  },
  
  getTileSource: function( callback ) {
    
    // if blank, don't try to GET it.
    if( !this.get('tile_source') ) {
      callback(null);
      return;
    }
    
    var infoURLTemplate = _.template("<%= tileSource %>/info.json");
    
    $.ajax({
      url: infoURLTemplate( { tileSource: this.get('tile_source') }),
      dataType: 'json',
      success: function( obj ) {
        callback( new OpenSeadragon.IIIFTileSource(obj) );
      }
    }); 
  }
  
});

TextLab.LeafCollection = Backbone.Collection.extend({
  model: TextLab.Leaf,
  url: "leafs",
    
  addLeaf: function( leaf ) {
    leaf.set("document_id", this.documentID );
    this.add( leaf );
  }      
  
}); 