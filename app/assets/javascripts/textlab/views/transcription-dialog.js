TextLab.TranscriptionDialog = Backbone.View.extend({
    
	template: JST['textlab/templates/transcription-dialog'],
  
  id: 'transcription-dialog-container',
  
	partials: {
		stringInput: JST['textlab/templates/common/string-input']
	},
  
  events: {
    'click .ok-button': 'onOK',
    'click .cancel-button': 'onCancel'
  },
            	
	initialize: function(options) {
    this.callback = options.callback;
    this.mode = options.mode;
  },
  
  onOK: function() {    
    this.close( _.bind( function() {            
      this.model.set({
        name: this.$('#name').val() 
      });
      this.callback(this.model);
    }, this));
  },
  
  onCancel: function() {    
    this.close();
  },
    
  close: function( closeCallback ) {
    var sectionModal = $('#transcription-modal');
    
    sectionModal.on('hidden.bs.modal', _.bind( function () {
      this.$el.detach();
      if( closeCallback ) {
        closeCallback();
      }
    }, this));
    
    sectionModal.modal('hide');
  },
  
  render: function() {
    this.$el.html(this.template({ transcription: this.model, partials: this.partials, mode: this.mode }));    
    $('#modal-container').html(this.$el);
    $('#transcription-modal').modal('show');
  } 
    
});