TextLab.MembersPanel = Backbone.View.extend({

	template: JST['textlab/templates/members-panel'],
    
  id: 'members-panel',
  
  events: {
    'click .invite-user-button': 'onInviteUser',
    'click .remove-member-button': 'onRemoveMember'
  },
            	
	initialize: function(options) {
    this.validationMessage = "";
  },
  
  onInviteUser: function() {
    // try to create a new membership 
    var email = this.$("#invite-user-email").val();
    var membership = new TextLab.Membership({
      email: email, 
      document_id: this.collection.document.id, 
      primary_editor: true,
      secondary_editor: false }
    );
    membership.save(null, { 
      success: _.bind( function(member) {  
        if( member.get('validation_message') ) {
          this.validationMessage = member.get('validation_message');
        } else {
          this.collection.add(member);
          this.validationMessage = "";
        }
        this.render();
      },this),      
      error: TextLab.Routes.routes.onError 
    });    
  },
  
  onRemoveMember: function(event) {
    var removeMemberButton = $(event.currentTarget);
    var membershipID = parseInt(removeMemberButton.attr("data-member-id"));    
    var membership = this.collection.findWhere({ id: membershipID });
    
    // remove the membership entry
    membership.destroy( {
      success: _.bind( function() {
        this.collection.remove( membership );
        this.render();
      }, this ),
      error: TextLab.Routes.routes.onError
    });    
  },
  
  render: function() {                  
    this.$el.html(this.template({ 
      members: this.collection.toJSON(), 
      validationMessage: this.validationMessage 
    }));
  }
  
});