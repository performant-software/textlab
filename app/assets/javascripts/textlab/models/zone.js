TextLab.Zone = Backbone.Model.extend({
  urlRoot: "zones",
  
  initialize: function( attributes, options ) {  
      // TODO record rect and id    
  },
  
});

TextLab.ZoneCollection = Backbone.Collection.extend({
  model: TextLab.Zone,
  url: "zones",
    
  initialize: function( models, options ) {
    
  },
  
  addZone: function( rect ) {
    // TODO makes sure no two zones have the same id
    
    var zone = new TextLab.Zone( rect );
        
  }     
  
}); 