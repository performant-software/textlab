
TextLab.Routes = Backbone.Router.extend({

  routes: {
    "" : "testPage"
  },
    
  initialize: function(options) {
                      
    // global singleton
    TextLab.Routes.routes = this;
        
  },
  
  testPage: function() {
    var testPage = new TextLab.TestPage();
    testPage.render();
  },
  
   // TODO improve error handling
  onError: function( collection, response, options ) {
     alert(response);    
  }    

});