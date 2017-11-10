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
    var onCreateCallback = _.bind(function(site) {   
      site.save(null, { 
        success: _.bind( function( site ) {  
          this.collection.add(site);
          this.render();
        },this),      
        error: TextLab.Routes.routes.onError 
      });
    }, this);  
    
    var site = new TextLab.Site();
    var siteDialog = new TextLab.SiteDialog( { model: site, callback: onCreateCallback } );
    siteDialog.render();     
  },

  onEditSite: function(e) {    

    var editButton = $(e.currentTarget);
    var siteID = parseInt(editButton.attr("data-id"));

    var callback = _.bind(function(site) {
      site.save(null, { 
        success: _.bind( function( site ) {  
          this.render();
        },this),      
        error: TextLab.Routes.routes.onError 
      });
    }, this);
    
    var deleteCallback = _.bind(function(site) {
      site.destroy({ success: _.bind( function() {
        this.render();
      }, this), error: TextLab.Routes.onError });            
    }, this);

    var site = this.collection.get(siteID);
          
    var siteDialog = new TextLab.SiteDialog( { 
      model: site, 
      callback: callback, 
      deleteCallback: deleteCallback, 
      mode: 'edit' 
    });
    siteDialog.render();     
    return false;
  },
  
  render: function() {                      
    this.$el.html(this.template({ sites: this.collection.toJSON() }));
  }
  
});
