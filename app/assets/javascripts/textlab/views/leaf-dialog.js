TextLab.LeafDialog = Backbone.View.extend({
    
	template: JST['textlab/templates/leaf-dialog'],
  
  id: 'leaf-dialog-container',
  
	partials: {
		stringInput: JST['textlab/templates/common/string-input']
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
    var documentModal = $('#leaf-modal');
    
    documentModal.on('hidden.bs.modal', _.bind( function () {
      this.$el.detach();
      if( closeCallback ) {
        closeCallback();
      }
    }, this));
    
    documentModal.modal('hide');
  },
  
  render: function() {
    this.$el.html(this.template({ document: this.model, partials: this.partials }));    
    $('#modal-container').html(this.$el);
    $('#leaf-modal').modal('show');
  } 
    
});