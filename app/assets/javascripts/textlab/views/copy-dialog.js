TextLab.CopyDialog = Backbone.View.extend({
    
	template: JST['textlab/templates/copy-dialog'],
  
  id: 'copy-dialog-container',
  
	partials: {
		stringInput: JST['textlab/templates/common/string-input'],
	},
  
  events: {
    'click .ok-button': 'onOK',
    'click .cancel-button': 'onCancel'
  },
            	
	initialize: function(options) {
    this.callback = options.callback;
    this.editorType = options.editorType;
  },
  
  onOK: function() {    
    this.close(_.bind(function() {
      this.callback(this.$('#name').val());
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
    this.$el.html(this.template({ 
      name: (this.model) ? this.model.get('name') : '',
      partials: this.partials
    }));    

    $('#modal-container').html(this.$el);
    $('#tab-modal').modal('show');
  } 
    
});