TextLab.NarrativeStepDialog = Backbone.View.extend({
    
	template: JST['textlab/templates/narrative-step-dialog'],
  
  id: 'narrative-step-dialog-container',
  
	partials: {
    dropdownInput: JST['textlab/templates/common/dropdown-input'],
    numberInput: JST['textlab/templates/common/number-input']	
  },
  
  events: {
    'click .ok-button': 'onOK',
    'click .cancel-button': 'onCancel'
  },
            	
	initialize: function(options) {
    this.callback = options.callback;
    this.mode = options.mode;
    this.zones = options.zones;
  },
  
  onOK: function() {    
    this.close( _.bind( function() {  
      var narrative = this.$('#narrative').summernote('code');
      var step = this.$('#step').summernote('code');

      this.model.set({
        zone_id: this.$('#zone_id').val(),
        step_number: this.$('#step_number').val(),
        step: step,
        narrative: narrative
      });
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
    this.$el.html(this.template({ 
      zones: this.zones,
      model: this.model.toJSON(), 
      partials: this.partials, 
      mode: this.mode 
    }));    
    $('#modal-container').html(this.$el);
    $('#step-modal').modal('show');

    // set up summernote text fields
    var toolbarConfig = [['style', ['bold', 'italic', 'underline', 'strikethrough', 'clear']]];
    $('#step').summernote({ toolbar: toolbarConfig });
    $('#narrative').summernote({ toolbar: toolbarConfig });
  } 
    
});