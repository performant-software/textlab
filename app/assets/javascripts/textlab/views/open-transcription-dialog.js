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
    this.transcriptions = options.transcriptions;
  },
  
  onOK: function() {    
    var transcriptionID = $('#transcription').val();    

    this.close( _.bind( function() {
      var transcription = _.find( this.transcriptions, function( t ) { return (t.id == transcriptionID); });
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
    
    var dropDownList = _.map( this.transcriptions, function(transcription) { 
      return { 
        value: transcription.id, 
        text: transcription.get('name'),
      }; 
    });
      
    dropDownList = _.sortBy(dropDownList, function(opt) { return opt.text; } ); 
    
    this.$el.html(this.template({ transcriptions: dropDownList, partials: this.partials }));    
    $('#modal-container').html(this.$el);
    $('#open-transcription-modal').modal('show');
  } 
    
});