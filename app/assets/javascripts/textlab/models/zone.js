TextLab.Zone = Backbone.Model.extend({
  urlRoot: "zones"
  
  // TODO has coordinate info and id
  
});

TextLab.ZoneCollection = Backbone.Collection.extend({
  model: TextLab.Zone,
  url: "zones",
  
  // TODO makes sure no two zones have the same id
  
  initialize: function( models, options ) {
    
  }      
  
}); 