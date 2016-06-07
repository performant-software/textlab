
TextLab.Routes = Backbone.Router.extend({

  routes: {
    "" : "primaryEditingView"
  },
    
  initialize: function(options) {
                      
    // global singleton
    TextLab.Routes.routes = this;
        
  },
  
  primaryEditingView: function() {
    var primaryEditingView = new TextLab.PrimaryEditingView();
    primaryEditingView.render();    
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