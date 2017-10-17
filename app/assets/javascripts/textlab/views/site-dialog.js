TextLab.SiteDialog = Backbone.View.extend({
    
	template: JST['textlab/templates/site-dialog'],
  
  id: 'site-dialog-container',
  
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
    var deleteButton = this.$('.delete-button');
    deleteButton.confirmation('show');    
      
    // delete if confirmed
    this.$el.on('confirmed.bs.confirmation', _.bind( function () {
      this.close( _.bind( function() {
        this.deleteCallback(this.model);
      },this) );
    }, this));
  },
  
  close: function( closeCallback ) {
    var siteModal = $('#site-modal');
    
    siteModal.on('hidden.bs.modal', _.bind( function () {
      this.$el.detach();
      if( closeCallback ) {
        closeCallback();
      }
    }, this));
    
    siteModal.modal('hide');
  },
  
  render: function() {
    this.$el.html(this.template({ site: this.model, partials: this.partials, mode: this.mode })); 

    $('#modal-container').html(this.$el);

    var siteModal = $('#site-modal');

    // add dragging behavior when shown
    siteModal.on('shown.bs.modal', function (e) {
      siteModal.draggable({
       handle: ".modal-header"
      });
    });

    siteModal.modal({ backdrop: false });
  } 
    
});