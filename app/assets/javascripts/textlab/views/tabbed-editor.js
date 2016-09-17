TextLab.TabbedEditor = Backbone.View.extend({
    
	template: JST['textlab/templates/tabbed-editor'],
  
  id: 'tabbed-editor',
  
  events: {
    'click .doc-tab': 'onSelectTab',
    'click .close-x': 'onClose',
    'click .add-tab-button': 'onAddTab'
  },
              	
	initialize: function(options) {
    this.openTranscriptions = [];
    this.xmlEditors = [];
  },
  
  initTranscriptions: function() {
    this.transcriptions = this.model.getTranscriptions();
    
    // if there are no transcriptions, create a blank one
    if(!this.transcriptions.length == 0) {
      var blankTranscription = new TextLab.Transcription();
      this.transcriptions.push( blankTranscription );
    }
    
    // for starters, open them all
    this.openTranscriptions = this.transcriptions;   
  },
  
  selectLeaf: function(leaf) {
    this.model = leaf;
    
    // close any open editor tabs
    _.each( this.openTranscriptions, function(transcription) {
      this.closeTab(transcription.cid);
    },this)
    
    this.initTranscriptions();
  },
    
  onSelectTab: function(event) {
    var selectedTab = $(event.currentTarget);
    var tabID = parseInt(selectedTab.attr("data-tab-id"));
    this.selectTab(tabID);
  },

  onClose: function(event) {
    var selectedTab = $(event.currentTarget);
    var tabID = parseInt(selectedTab.attr("data-tab-id"));
    this.closeTab(tabID);
  },
  
  onAddTab: function() {
    // TODO bring up the transcription dialog
  },
  
  selectTab: function(tabID) {
    // TODO change the active tab and hide/show the content panes
  },
  
  closeTab: function(tabID) {
     // TODO remove the tab
  },
    
  openXMLEditorTab: function(transcription) {
    
    // TODO add tab and content pane then add editor itself
    
    var xmlEditor = new TextLab.XMLEditor({ model: this.model });
    xmlEditor.render();
    this.$("#"+xmlEditor.id).replaceWith(xmlEditor.$el);
    
    this.xmlEditors.push(xmlEditor);
  },
      
  render: function() {      
    this.$el.html(this.template()); 

    _.each( this.openTranscriptions, function(transcription) {
      this.openXMLEditorTab(transcription);
    }, this);

    // select the first tab initially
    if( this.openTranscriptions.length > 0 ) {
      this.selectTab(_.first(this.openTranscriptions).cid);
    }
  },
  
  postRender: function(surfaceView) {
    _.each( this.xmlEditors, function(xmlEditor) {
      xmlEditor.initEditor();
      xmlEditor.setSurfaceView(surfaceView);   
    });    
  }
  
  
});