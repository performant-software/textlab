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
    var transcription = this.newTranscription();
    this.close( _.bind( function() {            
      transcription.set({
        name: this.$('#name').val() 
      });
      this.callback(transcription);
    }, this));
  },
  
  onCancel: function() {    
    this.close();
  },
  
  newTranscription: function() {  
    var documentID = this.model.get('document_id');
    var transcription = new TextLab.Transcription({ 
      leaf_id: this.model.id, 
      name: 'untitled',
      document_id: documentID, 
      shared: false, 
      submitted: false,
      published: false,
      owner: true
    });
    this.collection.add( transcription );
    return transcription;
  },
    
  close: function( closeCallback ) {
    var transcriptionModal = $('#transcription-modal');
    
    transcriptionModal.on('hidden.bs.modal', _.bind( function () {
      this.$el.detach();
      if( closeCallback ) {
        closeCallback();
      }
    }, this));
    
    transcriptionModal.modal('hide');
  },
  
  render: function() {
    
    var transcriptions = _.map( this.collection.toJSON(), function(transcription) { return { text: transcription.name, value: transcription.id }; });
    transcriptions = _.sortBy(transcriptions, function(opt) { return opt.text; } ); 
    
    this.$el.html(this.template({ leafName: this.model.get('name'), transcriptions: transcriptions, partials: this.partials }));    
    $('#modal-container').html(this.$el);
    $('#transcription-modal').modal('show');
  } 
    
});