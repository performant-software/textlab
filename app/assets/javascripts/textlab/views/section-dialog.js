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

    if( this.mode != 'edit' ) {
      this.leafManifestPanel = new TextLab.LeafManifestPanel({ model: this.model });
      this.leafManifestPanel.render();
      this.$("#"+this.leafManifestPanel.id).replaceWith(this.leafManifestPanel.$el);
    }

    $('#modal-container').html(this.$el);

    var sectionModal = $('#section-modal');

    // add dragging behavior when shown
    sectionModal.on('shown.bs.modal', function (e) {
      sectionModal.draggable({
       handle: ".modal-header"
      });
    });

    sectionModal.modal('show');
  } 
    
});