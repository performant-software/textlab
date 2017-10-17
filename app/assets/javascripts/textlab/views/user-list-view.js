TextLab.UserListView = Backbone.View.extend({

	template: JST['textlab/templates/user-list-view'],
    
  id: 'user-list-view',
  
  events: {
    'click .edit-user-button': "onEditUser"
  },
            	
	initialize: function(options) {
  },
  
  onEditUser: function() {    
    // var onCreateCallback = _.bind(function(doc) {
    //   this.collection.add(doc);
    //   doc.save(null, { success: _.bind( function() {
    //     this.render();
    //   },this)});
    // }, this);
          
    // var doc = new TextLab.Document();

    // // load project configs before we display dialog
    // doc.getProjectConfigs( _.bind(function( projectConfigs ) {
    //   var documentModalDialog = new TextLab.NewDocumentDialog( { 
    //     model: doc, 
    //     projectConfigs: projectConfigs,
    //     callback: onCreateCallback 
    //   });
    //   documentModalDialog.render();     
    // }, this));

  },
  
  render: function() {                      
    this.$el.html(this.template({ users: this.collection.toJSON() }));
  }
  
});