TextLab.Transcription = Backbone.Model.extend({
  urlRoot: "transcriptions",

  initialize: function( attributes, options ) {
    this.afterLoad(attributes);
  },

  afterLoad: function( attributes ) {
    if (attributes && attributes['zones']) {
      this.zones = new TextLab.ZoneCollection(attributes['zones']);
    } else {
      this.zones = new TextLab.ZoneCollection();
    }
  },

  addZone: function(zone) {
    var zoneID = this.get('next_zone_label')
    this.set('next_zone_label', zoneID + 1);
    zone.set('transcription_id', this.id);
    zone.generateZoneLabel(zoneID);
    this.zones.add(zone);
  },

  getZoneLabelPrefix: function() {
    return `#${this.get('xml_id')}-`;
  },

  removeZoneLabelPrefix: function(xmlZoneLabel) {
    var labelPrefix = this.getZoneLabelPrefix();
    return xmlZoneLabel.slice(labelPrefix.length);
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

  copy: function(attributes, callback) {
    const copyURL = _.template("/transcriptions/<%= transcriptionID %>/copy");

    $.ajax({
      method: 'POST',
      url: copyURL({ transcriptionID: this.id }),
      data: attributes,
      dataType: 'json',
      success: callback
    });
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

TextLab.Transcription.newTranscription = function( leaf, attrs = {} ) {
  var transcription = new TextLab.Transcription({
    leaf_id: leaf.id,
    name: 'untitled',
    document_id: leaf.get('document_id'),
    shared: false,
    submitted: false,
    published: false,
    owner: true,
    ...attrs
  });
  return transcription;
};

TextLab.TranscriptionCollection = Backbone.Collection.extend({
  model: TextLab.Transcription,
  url: "transcriptions"
});
