TextLab.SectionDialog = Backbone.View.extend({
    
	template: JST['textlab/templates/section-dialog'],
  
  id: 'section-dialog-container',
  
	partials: {
		stringInput: JST['textlab/templates/common/string-input']
	},
  
  events: {
    'click .ok-button': 'onOK',
    'click .cancel-button': 'onCancel',
    'click .delete-button': 'onDelete'
  },
            	
	initialize: function(options) {
    this.callback = options.callback;
    this.deleteCallback = options.deleteCallback;
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
  
  onDelete: function() {
    this.close( _.bind( function() {
      this.deleteCallback(this.model);
    },this) );
  },
  
  close: function( closeCallback ) {
    var sectionModal = $('#section-modal');
    
    sectionModal.on('hidden.bs.modal', _.bind( function () {
      this.$el.detach();
      if( closeCallback ) {
        closeCallback();
      }
    }, this));
    
    sectionModal.modal('hide');
  },
  
  render: function() {
    this.$el.html(this.template({ section: this.model, partials: this.partials, mode: this.mode }));    
    $('#modal-container').html(this.$el);
    $('#section-modal').modal('show');
  } 
    
});