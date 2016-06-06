
TextLab.Routes = Backbone.Router.extend({

  routes: {
  },
    
  initialize: function(options) {
                      
    // global singleton
    TextLab.Routes.routes = this;
        
  },
  
   // TODO improve error handling
  onError: function( collection, response, options ) {
     alert(response);    
  }    

});