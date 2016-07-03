TextLab.Leaf = Backbone.Model.extend({
  urlRoot: "leaves",
  
  // TODO has a tile source url, a collection of zones, xml, sequences, parent, order #
  
  initialize: function() {
    this.zones = new TextLab.ZoneCollection();
  }
    
});

TextLab.LeafCollection = Backbone.Collection.extend({
  model: TextLab.Leaf,
  url: "leaves",
  
  initialize: function( models, options ) {
  
  }      
  
}); 