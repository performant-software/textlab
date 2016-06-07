TextLab.XMLEditor = Backbone.View.extend({

	template: _.template("<textarea class='xml-editor'></textarea>"),
    
  id: 'xml-editor',
            	
	initialize: function(options) {
  },
      
  render: function() {      
    
    this.$el.html(this.template({}));  

	
  }
  
  
});