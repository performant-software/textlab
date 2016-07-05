TextLab.Zone = Backbone.Model.extend({
  urlRoot: "zones",
  
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
  url: "zones"  
}); 