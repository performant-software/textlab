TextLab.NewDocumentDialog = Backbone.View.extend({
    
	template: JST['textlab/templates/new-document-dialog'],
  
  id: 'document-dialog-container',
  
	partials: {
		stringInput: JST['textlab/templates/common/string-input']
	},

  importMessageTemplate: _.template( 'Found <%= count %> leaves to import.' ),
  dropZoneMessageTemplate: _.template( '+ <%= count %> <i class="fa fa-file-o fa-lg"></i> Leaves'),
  importErrorMessage: "<span class='error'>Unable to parse selected file.</span>",
  mimeTypeErrorMessage: "<span class='error'>Manifest file must be in CSV Format.</span>",
  dropZoneInstructions: "Drop Leaf Manifest Here",
  
  events: {
    'click .create-button': 'onCreate',
    'click .cancel-button': 'onCancel',
    'drop #drop-zone': 'handleFileSelect',
    'dragover #drop-zone': 'handleDragOver'
  },
            	
	initialize: function(options) {
    this.callback = options.callback;
  },
  
  onCreate: function() {    
    this.close( _.bind( function() {
      this.model.set({
        name: this.$('#name').val(),
        description: this.$('#description').val() 
      });
      this.callback(this.model);
    }, this));
  },
  
  onCancel: function() {    
    this.close();
  },
  
  close: function( closeCallback ) {
    var documentModal = $('#new-document-modal');
    
    documentModal.on('hidden.bs.modal', _.bind( function () {
      this.$el.detach();
      if( closeCallback ) {
        closeCallback();
      }
    }, this));
    
    documentModal.modal('hide');
  },

  handleFileSelect: function(e) {
    var evt = e.originalEvent;
    evt.stopPropagation();
    evt.preventDefault();

    var files = evt.dataTransfer.files;
    var reader = new FileReader();

    // parse the leaf manifest
    reader.onload = _.bind( function(e) {
      var leafs = this.model.parseLeafManifest(reader.result);
      if( leafs.length > 0 ) {
        this.$('.import-message').html(this.importMessageTemplate({count: leafs.length}));
        this.$('.drop-zone-message').html(this.dropZoneMessageTemplate({count: leafs.length}));
        this.model.set('leaf_manifest', JSON.stringify(leafs) );
      } else {
        this.$('.import-message').html(this.importErrorMessage);
        this.$('.drop-zone-message').html(this.dropZoneInstructions);
        this.model.set('leaf_manifest', null );
      }
    }, this);

    var file = _.first(files);

    // validate MIME type
    if( file.type == 'text/plain' || file.type == '' || file.type == 'text/csv' ) {
      reader.readAsText(file);
    } else {
      this.$('.import-message').html(this.mimeTypeErrorMessage);
      this.$('.drop-zone-message').html(this.dropZoneInstructions);
      this.model.set('leaf_manifest', null );
    }

  },

  handleDragOver: function(e) {
    var evt = e.originalEvent;
    evt.stopPropagation();
    evt.preventDefault();
    evt.dataTransfer.dropEffect = 'copy'; // Explicitly show this is a copy.
  },
  
  render: function() {
    this.$el.html(this.template({ document: this.model, partials: this.partials, dropZoneInstructions: this.dropZoneInstructions }));    
    $('#modal-container').html(this.$el);
    $('#new-document-modal').modal('show');
  } 
    
});