TextLab.SiteListView = Backbone.View.extend({

	template: JST['textlab/templates/site-list-view'],
    
  id: 'site-list-view',
  
  events: {
    'click .edit-site-button': "onEditSite",
    'click .new-site-button': "onNewSite"
  },
            	
	initialize: function(options) {
  },

  onNewSite: function() {
    // TODO
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
    this.$el.html(this.template({ sites: this.collection.toJSON() }));
  }
  
});