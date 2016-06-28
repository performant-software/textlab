TextLab.Zone = Backbone.Model.extend({
  urlRoot: "zones",
  
  initialize: function( attributes ) {
    this.generateZoneIDLabel( attributes.zone_id );
  },
  
  generateZoneIDLabel: function( zoneID ) {    
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
    
    this.zoneIDLabel = zeros + zoneID;
  }
  
});

TextLab.ZoneCollection = Backbone.Collection.extend({
  model: TextLab.Zone,
  url: "zones",
    
  initialize: function( models, options ) {
    this.nextZoneID = 1;
  },
  
  addZone: function( rect ) {
    var zone = new TextLab.Zone({ 
      zone_id: this.nextZoneID++,
      ulx: rect.left,
      uly: rect.top,
      lrx: rect.right,
      lry: rect.bottom 
    });
    this.add( zone );
        
    return zone;
  }     
  
}); 