TextLab.Transcription = Backbone.Model.extend({
  urlRoot: "transcriptions",

  initialize: function( attributes, options ) {
    this.afterLoad( attributes );
  },
  
  isReadOnly: function( isProjectOwner ) {
    var owner = this.get('owner');
    var shared = this.get('shared');
    var submitted = this.get('submitted');
    var readOnly = false;

    if( shared && !owner ) {
      readOnly = true;
    }

    if( submitted && owner ) {
      readOnly = true;
    }

    if( submitted && isProjectOwner ) {
      readOnly = false;
    }

    return readOnly;
  },

  sync: function(method, model, options) {

    // add hook for afterLoad event that does something after the model has been loaded
    if( this.afterLoad && (method == 'read' || method == 'create') ) {
      if( options.success ) {
        var originalCallback = options.success;
        options.success = _.bind( function( attributes ) {
          this.afterLoad( attributes );
          originalCallback( attributes );
        }, this);
      } else {
        options.success = _.bind( this.afterLoad, this );
      }
    }

    if( this.beforeSave && method == 'update' ) {
      this.beforeSave();
    }

    Backbone.sync(method, model, options);
  }

});

TextLab.Transcription.newTranscription = function( leaf ) {
  var transcription = new TextLab.Transcription({
    leaf_id: leaf.id,
    name: 'untitled',
    document_id: leaf.get('document_id'),
    shared: false,
    submitted: false,
    published: false,
    owner: true
  });
  return transcription;
};

TextLab.TranscriptionCollection = Backbone.Collection.extend({
  model: TextLab.Transcription,
  url: "transcriptions"
});
