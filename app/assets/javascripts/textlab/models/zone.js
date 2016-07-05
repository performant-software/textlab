TextLab.Zone = Backbone.Model.extend({
  urlRoot: "zones",
  
  initialize: function( attributes ) {
    if( attributes.zone_id ) {
      this.generateZoneIDLabel( attributes.zone_id );
    }
  },
  
  generateZoneLabel: function( zoneID ) {    
        
    var zeros = "";

    if( zoneID < 10 ) {
      zeros = zeros + "0";
    }
    
    if( zoneID < 100 ) {
      zeros = zeros + "0";
    }
    
    if( zoneID < 1000 ) {
      zeros = zeros + "0";
    }
    
    var zoneLabel = zeros + zoneID;
    this.set("zone_label", zoneLabel);
  }
  
});

TextLab.ZoneCollection = Backbone.Collection.extend({
  model: TextLab.Zone,
  url: "zones",
    
  initialize: function( models, options ) {
    this.nextZoneID = 1;
    this.leafID = options.leafID;
  },
  
  addZone: function( zone ) {
    var zoneID = this.nextZoneID++;
    zone.set("leaf_id", this.leafID );
    zone.generateZoneLabel(zoneID);
    this.add( zone );
  }     
  
}); 