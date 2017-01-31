TextLab.NarrativeStepDialog = Backbone.View.extend({
    
	template: JST['textlab/templates/narrative-step-dialog'],
  
  id: 'narrative-step-dialog-container',
  
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
      // this.model.set({
      //   name: this.$('#name').val(),
      //   xml_id: this.$('#xml_id').val(),
      //   tile_source: this.$('#tile_source').val() 
      // });
      this.callback(this.model);
    }, this));
  },
  
  onCancel: function() {    
    this.close();
  },
  
  close: function( closeCallback ) {
    var documentModal = $('#step-modal');
    
    documentModal.on('hidden.bs.modal', _.bind( function () {
      this.$el.detach();
      if( closeCallback ) {
        closeCallback();
      }
    }, this));
    
    documentModal.modal('hide');
  },
  
  render: function() {
    this.$el.html(this.template({ leaf: this.model, partials: this.partials, mode: this.mode }));    
    $('#modal-container').html(this.$el);
    $('#step-modal').modal('show');

    var toolbarConfig = [['style', ['bold', 'italic', 'underline', 'strikethrough', 'clear']]];
    
    $('#step').summernote({
      toolbar: toolbarConfig
    });

    $('#narrative').summernote({
      toolbar: toolbarConfig
    });

  } 
    
});