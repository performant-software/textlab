TextLab.TestPage = Backbone.View.extend({

	template: JST['textlab/templates/test-page'],
    
  id: 'test-page',
            	
	initialize: function(options) {
  },
      
  render: function() {      
    this.$el.html(this.template({}));  
    $(".textlab-app").html(this.$el);
  }
  
});