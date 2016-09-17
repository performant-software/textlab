TextLab.Transcription = Backbone.Model.extend({
  urlRoot: "transcriptions",
  
  initialize: function( attributes, options ) {
    
  }
    
});

TextLab.TranscriptionCollection = Backbone.Collection.extend({
  model: TextLab.Transcription,
  url: "transcriptions"
}); 