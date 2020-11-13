TextLab.TabDialog = Backbone.View.extend({
    
	template: JST['textlab/templates/tab-dialog'],
  
  id: 'tab-dialog-container',
  
	partials: {
		stringInput: JST['textlab/templates/common/string-input'],
    dropdownInput: JST['textlab/templates/common/dropdown-input']
	},
  
  events: {
    'click .ok-button': 'onOK',
    'click .cancel-button': 'onCancel',
    'change #editorType': 'onEditorTypeChange'
  },
            	
	initialize: function(options) {
    this.callback = options.callback;
    this.leaf = options.leaf;
    this.mode = options.mode;
    this.transcriptions = options.transcriptions;
  },

  onEditorTypeChange: function () {
    this.$('.transcription-id').toggle();
  },
  
  onOK: function() {    
    this.close( _.bind( function() { 

      var editorType = this.$('#editorType').val();
      if (this.mode != 'edit') {
        if( editorType == 'transcription' ) {
          this.model = TextLab.Transcription.newTranscription(this.leaf);
        } else {
          const transcriptionId = this.$('#transcriptionId').val();
          const documentId = this.leaf.document_id;
          this.model = TextLab.Sequence.newSequence(transcriptionId, documentId);
        }        
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
    var sectionModal = $('#tab-modal');
    
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
      { value: 'transcription', text: 'Transcription' }
    ];

    if( !this.model && this.leaf.get('secondary_enabled') ) {
      editorTypeList.push( { value: 'sequence', text: 'Sequence' } );
    }

    const transcriptionsList = _.map(this.transcriptions, (t) => ({ value: t.id, text: t.get('name') }));

    this.$el.html(this.template({ 
      name: (this.model) ? this.model.get('name') : '', 
      editorTypes: editorTypeList, 
      partials: this.partials, 
      mode: this.mode,
      transcriptions: transcriptionsList
    }));    

    $('#modal-container').html(this.$el);
    $('#tab-modal').modal('show');
  } 
    
});