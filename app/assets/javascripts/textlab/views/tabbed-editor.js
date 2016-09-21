TextLab.TabbedEditor = Backbone.View.extend({
    
	template: JST['textlab/templates/tabbed-editor'],
  
  id: 'tabbed-editor',
  
	partials: {
		tab: JST['textlab/templates/common/tab'],
		tabPane: JST['textlab/templates/common/tab-pane']
	},
  
  events: {
    'click .doc-tab': 'onSelectTab',
    'click .close-x': 'onClose',
    'click .add-tab-button': 'onAddTab'
  },
                	
	initialize: function(options) {
    _.bindAll( this, "initTranscriptions" );
  },
  
  initTranscriptions: function( callback ) {    
    this.model.getTranscriptions( _.bind( function( transcriptions ) {
      this.collection = transcriptions;
      
      // if there are no transcriptions, create a blank one
      if(this.collection.models.length == 0) {
        var documentID = this.model.collection.document.id;
        this.collection.add( new TextLab.Transcription({ leaf_id: this.model.id, document_id: documentID, shared: false, submitted: false }) );
      }
    
      callback();
    },this) );
  },
  
  selectLeaf: function(leaf) {
    this.model = leaf;
    this.render();
  },
    
  onSelectTab: function(event) {
    var selectedTab = $(event.currentTarget);
    var tabID = parseInt(selectedTab.attr("data-tab-id"));
    var tab = _.find( this.tabs, function(tab) { return tab.id == tabID });
    this.selectTab(tab);
  },

  onClose: function(event) {
    var selectedTab = $(event.currentTarget);
    var tabID = parseInt(selectedTab.attr("data-tab-id"));
    var tab = _.find( this.tabs, function(tab) { return tab.id == tabID });
    this.closeTab(tab);
  },
  
  onAddTab: function() {
    // TODO bring up the transcription dialog
  },
  
  onSplitPaneResize: function( parentPanel ) {    
    var xmlEditorToolbar = this.$(".xml-editor-toolbar");
    _.each( this.tabs, function(tab) {
      if( tab.xmlEditor.editor ) {
        tab.xmlEditor.editor.setSize( parentPanel.width(), parentPanel.height() - xmlEditorToolbar.height() - 15 );
      }
    }, this);
  },
  
  selectTab: function(tab) {
    // TODO change the active tab and hide/show the content panes
    this.activeTab = tab;
  },
  
  closeTab: function(tab) {
     // TODO remove the tab
  },
    
  openXMLEditorTab: function(transcription) {    
    var xmlEditor = new TextLab.XMLEditor({ model: transcription, leaf: this.model });
    xmlEditor.render();

    var tab = { 
      id: 'tab-'+transcription.cid, 
      name: transcription.get('name'),
      xmlEditor: xmlEditor,
      transcription: transcription
    };
    
    this.$(".tabs").append( this.partials.tab(tab) );
    this.$(".tab-panes").append( this.partials.tabPane({ id: tab.id }) );
    this.$("#"+tab.id).append( xmlEditor.$el );
    
    tab.xmlEditor.initEditor();
    tab.xmlEditor.setSurfaceView(this.surfaceView);
    this.tabs.push(tab);
  },
      
  render: function() {
    
    this.tabs = [];
    
    // TODO start with loading spinner active
    this.$el.html(this.template()); 
    
    this.initTranscriptions( _.bind( function() {
      _.each( this.collection.models, function( transcription ) {
        this.openXMLEditorTab(transcription);
      }, this);
      
      // select the first tab initially
      if( this.tabs.length > 0 ) {
        this.selectTab(_.first(this.tabs));
      }
    }, this) );              
  },
  
  postRender: function(surfaceView) {
    this.surfaceView = surfaceView;
  }
  
  
});