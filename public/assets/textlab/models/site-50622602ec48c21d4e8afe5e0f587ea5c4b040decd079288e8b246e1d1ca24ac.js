TextLab.Site = Backbone.Model.extend({
  urlRoot: "sites",
      
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

TextLab.SiteCollection = Backbone.Collection.extend({
  model: TextLab.Site,
  url: "sites"
}); 
