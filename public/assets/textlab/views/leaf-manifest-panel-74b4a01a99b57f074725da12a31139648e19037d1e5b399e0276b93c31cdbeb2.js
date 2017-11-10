TextLab.LeafManifestPanel = Backbone.View.extend({

	template: JST['textlab/templates/leaf-manifest-panel'],
    
  id: 'leaf-manifest-panel',
  
  importMessageTemplate: _.template( 'Found <%= count %> leaves to import.' ),
  dropZoneMessageTemplate: _.template( '+ <%= count %> <i class="fa fa-file-o fa-lg"></i> Leaves'),
  importErrorMessage: "<span class='error'>Unable to parse selected file.</span>",
  mimeTypeErrorMessage: "<span class='error'>Manifest file must be in CSV Format.</span>",
  dropZoneInstructions: "Drop Leaf Manifest Here",
  
  events: {
    'drop #drop-zone': 'handleFileSelect',
    'dragover #drop-zone': 'handleDragOver'
  },

            	
	initialize: function(options) {
    
  },

  parseIIIFManifest: function(manifestJSON) {

    var manifest = JSON.parse(manifestJSON);

    if( manifest == null ) {
      return [];
    }

    // IIIF presentation 2.0
    // manifest["sequences"][n]["canvases"][n]["images"][n]["resource"]["service"]["@id"]

    var leafs = [];

    sequence = _.first(manifest.sequences);
    if( sequence != null && sequence.canvases != null ) {
      leafs = _.map( sequence.canvases, function(canvas) {
        var image = _.first( canvas.images );

        if( image != null && 
            image.resource != null &&
            image.resource.service != null ) {
            return {
              name: canvas.label,
              xml_id: image.resource.service["@id"],
              tile_source: image.resource.service["@id"]
            };
        }
      }); 
    }

    return leafs;
  },

  parseLeafManifest: function(leafManifest) {

    // read this text a line at a time, create a JSON representation of it to send to server.

    var lines = leafManifest.split('\n');
    var leafs = [];

    _.each( lines, function(line) {
      var fields = line.split(',');
      // expect exactly 3 columns in each line
      if( fields.length == 3 ) {
        var leaf = {};
        for( var i=0; i < fields.length; i++ ) {
          var field = fields[i];
          if( i == 0 ) {
            leaf.name = field;
          } 
          else if( i == 1 ) {
            leaf.xml_id = field;
          }
          else if( i == 2 ) {
            leaf.tile_source = field;
          }
        }
  
        leafs.push(leaf);        
      } else {
        // unexpected number of fields
        return null;
      }
    });

    return leafs;
  },

   handleFileSelect: function(e) {
    var evt = e.originalEvent;
    evt.stopPropagation();
    evt.preventDefault();

    var files = evt.dataTransfer.files;
    var reader = new FileReader();

    var success = _.bind( function(leafs) {
      $('.import-message').html(this.importMessageTemplate({count: leafs.length}));
      this.$('.drop-zone-message').html(this.dropZoneMessageTemplate({count: leafs.length}));
      this.model.set('leaf_manifest', JSON.stringify(leafs) );
    }, this);

    var error = _.bind( function() {
      $('.import-message').html(this.importErrorMessage);
      this.$('.drop-zone-message').html(this.dropZoneInstructions);
      this.model.set('leaf_manifest', null );
    }, this);

    // parse the leaf manifest
    reader.onload = _.bind( function(e) {
      var leafs = this.parseLeafManifest(reader.result);
      if( leafs.length > 0 ) {
        success(leafs);
      } else {
        // try to parse this as a IIIF Manifest
        leafs = this.parseIIIFManifest(reader.result);
        if( leafs.length > 0 ) {
          success(leafs);
        }
        else {
          error();
        }
      }
    }, this);

    var file = _.first(files);
    reader.readAsText(file);

  },

  handleDragOver: function(e) {
    var evt = e.originalEvent;
    evt.stopPropagation();
    evt.preventDefault();
    evt.dataTransfer.dropEffect = 'copy'; // Explicitly show this is a copy.
  },
  
  render: function() {                  
    this.$el.html(this.template({ 
      dropZoneInstructions: this.dropZoneInstructions
    }));
  }
  
});
