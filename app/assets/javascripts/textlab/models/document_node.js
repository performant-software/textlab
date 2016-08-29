TextLab.DocumentNode = Backbone.Model.extend({
  urlRoot: "document_nodes",
  
  initialize: function( attributes, options ) {
    
  }
    
});

TextLab.DocumentNodeCollection = Backbone.Collection.extend({
  model: TextLab.DocumentNode,
  url: "document_nodes"
}); 