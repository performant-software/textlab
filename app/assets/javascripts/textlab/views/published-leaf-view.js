TextLab.PublishedLeafView = Backbone.View.extend({
    
	template: JST['textlab/templates/published-leaf-view'],
  
  id: 'published-leaf',
    
  events: {
  },
            	
	initialize: function(options) {
    // need document and which part to display initially (which might be null)
    
  },
    
  render: function() {
    this.$el.html(this.template({}));
    
  } 
    
});