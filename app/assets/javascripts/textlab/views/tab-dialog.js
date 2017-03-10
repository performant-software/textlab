TextLab.TabDialog = Backbone.View.extend({
    
	template: JST['textlab/templates/tab-dialog'],
  
  id: 'tab-dialog-container',
  
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
    this.leaf = options.leaf;
    this.mode = options.mode;
  },
  
  onOK: function() {    
    this.close( _.bind( function() { 

      var editorType = this.$('#editorType').val();
      if( this.mode != 'edit' ) {
        if( editorType == 'transcription' ) {
          this.model = TextLab.Transcription.newTranscription(this.leaf);
        } else {
          this.model = TextLab.Sequence.newSequence(this.leaf);
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

    if( this.leaf.get('secondary_enabled') ) {
      editorTypeList.push( { value: 'sequence', text: 'Sequence' } );
    }

    this.$el.html(this.template({ 
      name: (this.model) ? this.model.get('name') : '', 
      editorTypes: editorTypeList, 
      partials: this.partials, 
      mode: this.mode 
    }));    

    $('#modal-container').html(this.$el);
    $('#tab-modal').modal('show');
  } 
    
});