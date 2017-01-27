TextLab.TranscriptionDialog = Backbone.View.extend({
    
	template: JST['textlab/templates/transcription-dialog'],
  
  id: 'transcription-dialog-container',
  
	partials: {
		stringInput: JST['textlab/templates/common/string-input'],
    dropdownInput: JST['textlab/templates/common/dropdown-input']
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

      var editorType = this.$('#editorType').val();
      if( this.mode != 'edit' && editorType == 'transcription' ) {
        this.model = TextLab.Transcription.newTranscription();
      } else {
        this.model = TextLab.Sequence.newSequence();
      }

      this.model.set({
        name: this.$('#name').val() 
      });
      this.callback(this.model,editorType);
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

    var editorTypeList = [ 
      { value: 'transcription', text: 'Transcription' },
      { value: 'sequence', text: 'Sequence' } 
    ];

    this.$el.html(this.template({ 
      model: this.model, 
      editorTypes: editorTypeList, 
      partials: this.partials, 
      mode: this.mode 
    }));    

    $('#modal-container').html(this.$el);
    $('#transcription-modal').modal('show');
  } 
    
});