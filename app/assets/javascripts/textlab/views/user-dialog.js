TextLab.UserDialog = Backbone.View.extend({
    
	template: JST['textlab/templates/user-dialog'],
  
  id: 'user-dialog-container',
  
	partials: {
		stringInput: JST['textlab/templates/common/string-input'],
    dropdownInput: JST['textlab/templates/common/dropdown-input']
	},
  
  events: {
    'click .ok-button': 'onOK',
    'click .cancel-button': 'onCancel'
  },
            	
	initialize: function(options) {
    this.callback = options.callback;
    this.sites = options.sites;
    this.mode = options.mode;
  },
  
  onOK: function() {    
    this.close( _.bind( function() {            
      this.model.set({
        username: this.$('#username').val(),
        first_name: this.$('#first_name').val(),
        last_name: this.$('#last_name').val(),
        email: this.$('#email').val(),
        site_id: this.$('#site').val(),  
      });
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

    this.$el.html(this.template({ user: this.model, sites: siteList, partials: this.partials })); 

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