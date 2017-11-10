TextLab.User = Backbone.Model.extend({
  urlRoot: "accounts",
      
  afterLoad: function( model ) {
    
  },
  
  sync: function(method, model, options) {
    
    // add hook for afterLoad event that does something after the model has been loaded
    if( this.afterLoad && (method == 'read' || method == 'create') ) {    
      if( options.success ) {
        var originalCallback = options.success;
        options.success = _.bind( function( model ) { 
          this.afterLoad( model );
          originalCallback( model );
        }, this);
      } else {
        options.success = _.bind( this.afterLoad, this );
      }      
    }
    
    Backbone.sync(method, model, options);
  }
      
});

TextLab.UserCollection = Backbone.Collection.extend({
  model: TextLab.User,
  url: "accounts",

  getSites: function( callback ) {
    var sites = new TextLab.SiteCollection();
    sites.fetch( { success: callback, error: TextLab.Routes.routes.onError } );
  }
}); 
