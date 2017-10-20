TextLab.UserDialog = Backbone.View.extend({
    
	template: JST['textlab/templates/user-dialog'],
  
  id: 'user-dialog-container',

  userTypes: [ 
    { value: 'user', text: 'User' },
    { value: 'site_admin', text: 'Site Admin' },
    { value: 'admin', text: 'TextLab Admin' } 
  ],
  
  accountStatusTypes: [ 
    { 'pending': 'Pending' },
    { 'active': 'Active' },
    { 'archived': 'Archived' } 
  ],

	partials: {
		stringInput: JST['textlab/templates/common/string-input'],
    dropdownInput: JST['textlab/templates/common/dropdown-input']
	},
  
  events: {
    'click .archive-user-button': 'onArchive',
    'click .ok-button': 'onOK',
    'click .cancel-button': 'onCancel'
  },
            	
	initialize: function(options) {
    this.callback = options.callback;
    this.sites = options.sites;
    this.mode = options.mode;
    this.isAdmin = options.isAdmin;
  },
  
  onOK: function() {    
    this.close( _.bind( function() {            
      this.model.set({
        username: this.$('#username').val(),
        first_name: this.$('#first_name').val(),
        last_name: this.$('#last_name').val(),
        email: this.$('#email').val(),
        site_id: this.$('#site').val(),  
        user_type: this.$('#user_type').val()  
      });
      this.callback(this.model);
    }, this));
  },

  onArchive: function() {
    this.close( _.bind( function() {            
      this.model.set( 'requested_status', 'archived' );
      this.callback(this.model);
    }, this));
  },
  
  onCancel: function() {    
    this.close();
  },
  
  
  close: function( closeCallback ) {
    var userModal = $('#user-modal');
    
    userModal.on('hidden.bs.modal', _.bind( function () {
      this.$el.detach();
      if( closeCallback ) {
        closeCallback();
      }
    }, this));
    
    userModal.modal('hide');
  },
  
  render: function() {

    var siteList = _.map( this.sites.models, function(site) { 
      return { 
        value: site.id, 
        text: site.get('name'),
      }; 
    });

    this.$el.html(this.template({ 
      user: this.model, 
      sites: siteList, 
      userTypes: this.userTypes, 
      partials: this.partials,
      isAdmin: this.isAdmin
    })); 

    $('#modal-container').html(this.$el);

    var userModal = $('#user-modal');

    // add dragging behavior when shown
    userModal.on('shown.bs.modal', function (e) {
      userModal.draggable({
       handle: ".modal-header"
      });
    });

    userModal.modal({ backdrop: false });
  } 
    
});