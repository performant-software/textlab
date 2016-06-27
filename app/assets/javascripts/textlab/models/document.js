TextLab.Document = Backbone.Model.extend({
  urlRoot: "documents"
  
  // TODO has a collection of leaves, list of children, metadata, and userid
  
});

TextLab.DocumentCollection = Backbone.Collection.extend({
  model: TextLab.Document,
  url: "documents",
  
  initialize: function( models, options ) {
  
  }      
  
}); 