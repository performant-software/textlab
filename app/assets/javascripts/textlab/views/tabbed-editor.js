TextLab.TabbedEditor = Backbone.View.extend({
    
	template: JST['textlab/templates/tabbed-editor'],
  
  id: 'tabbed-editor',
  
  events: {
    'click .doc-tab': 'onSelectTab',
    'click .close-x': 'onClose',
    'click .add-tab-button': 'onAddTab'
  },
              	
	initialize: function(options) {

  },
  
  selectLeaf: function(leaf) {
    this.xmlEditor.selectLeaf(leaf);    
  },
  
  onSelectTab: function(event) {
    var selectedTab = $(event.currentTarget);
    var tabID = parseInt(selectedTab.attr("data-tab-id"));
    
    // hide current tab and display the selected tab
    
    
  },
  
  onClose: function(event) {
    // TODO close the selected tab
  },
  
  onAddTab: function() {
    // TODO bring up the transcription dialog
  },
      
  render: function() {      
    this.$el.html(this.template({  })); 

    this.xmlEditor = new TextLab.XMLEditor({ model: this.model });
    this.xmlEditor.render();
    this.$("#"+this.xmlEditor.id).replaceWith(this.xmlEditor.$el);
    
  },
  
  postRender: function(surfaceView) {
    this.xmlEditor.initEditor();
    
    // for listening to events related to zones
    this.xmlEditor.setSurfaceView(surfaceView);    
  }
  
  
});