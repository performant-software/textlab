TextLab.LeafDialog = Backbone.View.extend({
    
	template: JST['textlab/templates/leaf-dialog'],
  
  id: 'leaf-dialog-container',
  
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
      
      // TODO need to validate the name and URL
      
      this.model.set({
        name: this.$('#name').val(),
        xml_id: this.$('#xml_id').val(),
        tile_source: this.$('#tile_source').val() 
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
    this.$el.html(this.template({ leaf: this.model, partials: this.partials, mode: this.mode }));    
    $('#modal-container').html(this.$el);

    var leafModal = $('#leaf-modal');
    
    // add dragging behavior when shown
    leafModal.on('shown.bs.modal', function (e) {
      leafModal.draggable({
       handle: ".modal-header"
      });
    })

    leafModal.modal('show');
  } 
    
});