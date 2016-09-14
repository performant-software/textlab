TextLab.EditSettingsDialog = Backbone.View.extend({
    
	template: JST['textlab/templates/edit-settings-dialog'],
  
  id: 'settings-dialog-container',
  
	partials: {
		stringInput: JST['textlab/templates/common/string-input']
	},
  
  events: {
    'click .update-button': 'onUpdate',
    'click .cancel-button': 'onCancel'
  },
            	
	initialize: function(options) {
    this.callback = options.callback;
  },
  
  onUpdate: function() {    
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
    var editSettingsModal = $('#edit-settings-modal');
    
    editSettingsModal.on('hidden.bs.modal', _.bind( function () {
      this.$el.detach();
      if( closeCallback ) {
        closeCallback();
      }
    }, this));
    
    editSettingsModal.modal('hide');
  },
  
  render: function() {
    this.$el.html(this.template({ document: this.model.toJSON(), partials: this.partials }));    
    $('#modal-container').html(this.$el);
    $('#edit-settings-modal').modal('show');
  } 
    
});