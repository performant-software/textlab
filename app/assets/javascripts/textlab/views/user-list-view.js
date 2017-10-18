TextLab.UserListView = Backbone.View.extend({

	template: JST['textlab/templates/user-list-view'],
    
  id: 'user-list-view',
  
  events: {
    'click .edit-user-button': "onEditUser"
  },
            	
	initialize: function(options) {
  },
  
  onEditUser: function(e) {     
    var editButton = $(e.currentTarget);
    var userID = parseInt(editButton.attr("data-id"));

    var callback = _.bind(function(site) {
      site.save(null, { 
        success: _.bind( function( site ) {  
          this.render();
        },this),      
        error: TextLab.Routes.routes.onError 
      });
    }, this);
 
    var user = this.collection.get(userID);
          
    var userDialog = new TextLab.UserDialog( { 
      model: user, 
      callback: callback
    });
    userDialog.render();     
    return false;
  },
  
  render: function() {                      
    this.$el.html(this.template({ users: this.collection.toJSON() }));
  }
  
});