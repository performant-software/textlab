TextLab.UserListView = Backbone.View.extend({

	template: JST['textlab/templates/user-list-view'],
    
  id: 'user-list-view',
  
  events: {
    'click .edit-user-button': "onEditUser",
    'change #statusFilter': "onFilterSelect"
  },

  accountFilterTypes: [ 
    { value: 'all', text: 'No Filter' },
    { value: 'pending', text: 'Pending Status' },
    { value: 'active', text: 'Active Status' },
    { value: 'archived', text: 'Archived Status' } 
  ],

  partials: {
    dropdownInput: JST['textlab/templates/common/dropdown-input']
  },
            	
	initialize: function(options) {
    this.isAdmin = (TextLabSettings.user_type == 'admin');
    this.siteName = TextLabSettings.site_name;
    this.statusFilter = 'active';
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

    // load sites before we display dialog
    this.collection.getSites( _.bind(function( sites ) {
      var userDialog = new TextLab.UserDialog( { 
        model: user, 
        callback: callback,
        sites: sites,
        isAdmin: this.isAdmin
      });
      userDialog.render();   
    }, this));          
      
    return false;
  },

  onFilterSelect: function() {
    this.statusFilter = this.$('#statusFilter').val();
    this.render();
  },
  
  render: function() {    

    var users;
    if( this.statusFilter == 'all') {
      users = this.collection.toJSON();
    } else {
      users = _.filter( this.collection.toJSON(), function(user) {
        return user.account_status == this.statusFilter;
      }, this);      
    }

    this.$el.html(this.template({ 
      users: users, 
      isAdmin: this.isAdmin,
      siteName: this.siteName, 
      partials: this.partials,
      accountFilterTypes: this.accountFilterTypes,
      statusFilter: this.statusFilter
    }));
  }
  
});