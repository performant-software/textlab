TextLab.OpenTranscriptionDialog = Backbone.View.extend({
    
	template: JST['textlab/templates/open-transcription-dialog'],
  
  id: 'open-transcription-dialog-container',
  
	partials: {
    dropdownInput: JST['textlab/templates/common/dropdown-input']
	},
  
  events: {
    'click .ok-button': 'onOK',
    'click .cancel-button': 'onCancel'
  },
            	
	initialize: function(options) {
    this.callback = options.callback;
  },
  
  onOK: function() {    
    this.close( _.bind( function() {
      
      this.callback(transcription);
    }, this));
  },
  
  onCancel: function() {    
    this.close();
  },
    
  close: function( closeCallback ) {
    var transcriptionModal = $('#open-transcription-modal');
    
    transcriptionModal.on('hidden.bs.modal', _.bind( function () {
      this.$el.detach();
      if( closeCallback ) {
        closeCallback();
      }
    }, this));
    
    transcriptionModal.modal('hide');
  },
  
  render: function() {
    
    var transcriptions = _.map( this.collection.models, function(transcription) { 
      return { 
        value: transcription.id, 
        text: transcription.get('name'),
      }; 
    });
      
    transcriptions = _.sortBy(transcriptions, function(opt) { return opt.name; } ); 
    
    this.$el.html(this.template({ transcriptions: transcriptions, partials: this.partials }));    
    $('#modal-container').html(this.$el);
    $('#open-transcription-modal').modal('show');
  } 
    
});