TextLab.AttributeModalDialog = Backbone.View.extend({
    
	template: JST['textlab/templates/attribute-modal-dialog'],
  
  id: 'attribute-modal-container',
  
	partials: {
		stringInput: JST['textlab/templates/common/string-input'],
		dropdownInput: JST['textlab/templates/common/dropdown-input'],
    numberInput: JST['textlab/templates/common/number-input']
	},
  
  events: {
    'click .create-button': 'onCreate',
    'click .cancel-button': 'onCancel'
  },
            	
	initialize: function(options) {
    this.tag = options.tag;
    this.callback = options.callback;
  },
  
  onCreate: function() {    
    var attributesModal = $('#attributes-modal');
    
    // TODO generate attributes
    var attributes = "id='foo'";

    this.close( _.bind( function() {
      this.callback(attributes);
    }, this));
  },
  
  onCancel: function() {    
    this.close( _.bind( function() {
      // return no attributes
      this.callback(null);
    }, this));
  },
  
  close: function( closeCallback ) {
    var attributesModal = $('#attributes-modal');
    
    attributesModal.on('hidden.bs.modal', _.bind( function () {
      this.$el.detach();
      closeCallback();
    }, this));
    
    attributesModal.modal('hide');
  },
  
  render: function() {
    this.$el.html(this.template({ tag: this.tag, partials: this.partials }));    
    $('#modal-container').html(this.$el);
    $('#attributes-modal').modal('show');
  } 
    
});