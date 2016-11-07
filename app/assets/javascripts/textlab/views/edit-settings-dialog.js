TextLab.EditSettingsDialog = Backbone.View.extend({
    
	template: JST['textlab/templates/edit-settings-dialog'],
  publishURLTemplate: _.template( "<%= loc.protocol %>//<%= loc.hostname %><%= (loc.port==null||loc.port==80) ? '' : ':'+loc.port %>/document_sections/<%= id %>.html" ),
  fieldTitleTemplate: _.template( "Publish project to: <a target='_blank' href='<%= publishURL %>'><%= publishURL %></a>." ),
  
  id: 'settings-dialog-container',
  
	partials: {
		stringInput: JST['textlab/templates/common/string-input'],
    checkMark: JST['textlab/templates/common/check-mark']
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
        description: this.$('#description').val(),
        published: this.$('#published').is(":checked")
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

    var rootDocNode = this.model.getRootNode();
    var rootSection = rootDocNode.getSection();

    var publishURL = this.publishURLTemplate( { loc: window.location, id: rootSection.id } );
    var publishFieldTitle = this.fieldTitleTemplate( { publishURL: publishURL } );
    
    this.$el.html(this.template({ document: this.model.toJSON(), partials: this.partials, publishFieldTitle: publishFieldTitle }));    
    
    this.membersPanel = new TextLab.MembersPanel( { collection: this.model.members } );    
    this.membersPanel.render();
    this.$("#"+this.membersPanel.id).replaceWith(this.membersPanel.$el);
    
    $('#modal-container').html(this.$el);
    $('#edit-settings-modal').modal('show');
  } 
    
});