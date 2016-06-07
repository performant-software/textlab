TextLab.PrimaryEditingView = Backbone.View.extend({

	template: JST['textlab/templates/primary-editing-view'],
    
  id: 'primary-editing-view',
            	
	initialize: function(options) {
  },
      
  render: function() {      
    
    this.$el.html(this.template({}));  

		this.$('div.split-pane').splitPane();
    
    this.documentTreeView = new TextLab.DocumentTreeView();
    this.documentTreeView.render();
    this.$("#"+this.documentTreeView.id).replaceWith(this.documentTreeView.$el);
    
    this.leafImageViewer = new TextLab.LeafImageViewer();
    this.leafImageViewer.render();    
    this.$("#"+this.leafImageViewer.id).replaceWith(this.leafImageViewer.$el);
   
    this.xmlEditor = new TextLab.XMLEditor();
    this.xmlEditor.render();
    this.$("#"+this.xmlEditor.id).replaceWith(this.xmlEditor.$el);

    $(".textlab-app").html(this.$el);                
  
    this.leafImageViewer.renderImage();
  }
  
});