TextLab.EditSettingsDialog = Backbone.View.extend({
    
	template: JST['textlab/templates/edit-settings-dialog'],
  publishURLTemplate: _.template( "<%= loc.protocol %>//<%= loc.hostname %><%= (loc.port==null||loc.port==80) ? '' : ':'+loc.port %>/document_sections/<%= id %>.html" ),
  fieldTitleTemplate: _.template( "Publish project to: <a target='_blank' href='<%= publishURL %>'><%= publishURL %></a>." ),
  
  id: 'settings-dialog-container',
  
	partials: {
		stringInput: JST['textlab/templates/common/string-input'],
    checkMark: JST['textlab/templates/common/check-mark'],
    dropdownInput: JST['textlab/templates/common/dropdown-input']
	},
  events: {
    'click .update-button': 'onUpdate',
    'click .cancel-button': 'onCancel'
  },
            	
	initialize: function(options) {
    this.callback = options.callback;
    this.projectConfigs = options.projectConfigs;
  },
  
  onUpdate: function() {    
    this.close( _.bind( function() {
      var projectConfigID = this.$('#projectConfig').val();
      var configChanged = (projectConfigID != this.model.get('project_config_id'));

      this.model.set({
        name: this.$('#name').val(),
        description: this.$('#description').val(),
        published: this.$('#published').is(":checked"),
        project_config_id: projectConfigID,
      });

      if( configChanged ) {
        // fetch new project configs before we proceed
        this.model.updateProjectConfig( projectConfigID, _.bind(function() {
          this.callback(this.model, true);
        }, this));
      } else {
        this.callback(this.model, false);
      }
    
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

    var rootDocNode = this.model.getRootNode();
    var rootSection = rootDocNode.getSection();

    var publishURL = this.publishURLTemplate( { loc: window.location, id: rootSection.id } );
    var publishFieldTitle = this.fieldTitleTemplate( { publishURL: publishURL } );

    var projectConfigList = _.map( this.projectConfigs.models, function(projectConfig) { 
      return { 
        value: projectConfig.id, 
        text: projectConfig.get('name'),
      }; 
    });
    
    this.$el.html(this.template({ 
      document: this.model.toJSON(), 
      document_id: this.model.id,
      partials: this.partials, 
      projectConfigs: projectConfigList,
      publishFieldTitle: publishFieldTitle 
    }));    
    
      console.log("this.model is");
      console.log(this.model);
      console.log(this.model.attributes.id);
      console.log(this.model.id);
    this.membersPanel = new TextLab.MembersPanel( { collection: this.model.members } );    
    this.membersPanel.render();
    this.$("#"+this.membersPanel.id).replaceWith(this.membersPanel.$el);
    
    $('#modal-container').html(this.$el);

    var editSettingsModal = $('#edit-settings-modal');

    // add dragging behavior when shown
    editSettingsModal.on('shown.bs.modal', function (e) {
      editSettingsModal.draggable({
       handle: ".modal-header"
      });
    });

    editSettingsModal.modal({ backdrop: false });
  } 
    
});
