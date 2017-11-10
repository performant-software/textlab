TextLab.NewDocumentDialog = Backbone.View.extend({
    
	template: JST['textlab/templates/new-document-dialog'],
  
  id: 'document-dialog-container',
  
	partials: {
		stringInput: JST['textlab/templates/common/string-input'],
    dropdownInput: JST['textlab/templates/common/dropdown-input']
	},

  events: {
    'click .create-button': 'onCreate',
    'click .cancel-button': 'onCancel'
  },
            	
	initialize: function(options) {
    this.callback = options.callback;
    this.projectConfigs = options.projectConfigs;
  },
  
  onCreate: function() {    
    this.close( _.bind( function() {
      this.model.set({
        name: this.$('#name').val(),
        description: this.$('#description').val(),
        project_config_id: this.$('#projectConfig').val() 
      });
      this.callback(this.model);
    }, this));
  },
  
  onCancel: function() {    
    this.close();
  },
  
  close: function( closeCallback ) {
    var documentModal = $('#new-document-modal');
    
    documentModal.on('hidden.bs.modal', _.bind( function () {
      this.$el.detach();
      if( closeCallback ) {
        closeCallback();
      }
    }, this));
    
    documentModal.modal('hide');
  },
  
  render: function() {

    var projectConfigList = _.map( this.projectConfigs.models, function(projectConfig) { 
      return { 
        value: projectConfig.id, 
        text: projectConfig.get('name'),
      }; 
    });

    this.$el.html(this.template({ 
      document: this.model, 
      projectConfigs: projectConfigList,
      partials: this.partials 
    }));

    this.$('#leaf-manifest-panel')

    var leafPanelEl = this.$("#leaf-manifest-panel");
    this.leafManifestPanel = new TextLab.LeafManifestPanel({ el: leafPanelEl, model: this.model });
    this.leafManifestPanel.render();

    $('#modal-container').html(this.$el);
    $('#new-document-modal').modal('show');
  } 
    
});
