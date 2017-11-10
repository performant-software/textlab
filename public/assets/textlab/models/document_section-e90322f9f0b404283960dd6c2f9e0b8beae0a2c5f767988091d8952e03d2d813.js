TextLab.DocumentSection = Backbone.Model.extend({
  urlRoot: "document_sections",
  
  initialize: function( attributes, options ) {
    
  }
    
});

TextLab.DocumentSectionCollection = Backbone.Collection.extend({
  model: TextLab.DocumentSection,
  url: "document_sections"
}); 
