TextLab.Membership = Backbone.Model.extend({
  urlRoot: "memberships",
  
  initialize: function( attributes, options ) {
    
  }
    
});

TextLab.MembershipCollection = Backbone.Collection.extend({
  model: TextLab.Membership,
  url: "memberships"
}); 
