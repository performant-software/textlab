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
    this.parentPanel = options.parentPanel;
    this.projectOwner = options.projectOwner;
    _.bindAll( this, "initTranscriptions" );
  },
  
  initTranscriptions: function( callback ) {   
    if( !this.model ) return;
     
    this.model.getTranscriptions( _.bind( function( transcriptions ) {
      this.collection = transcriptions;
      this.collection.models = _.sortBy( this.collection.models, function(t) { t.get('name') });
      
      // if there are no transcriptions, create a blank one
      if(this.collection.models.length == 0) {
        this.newTranscription();
      }
    
      callback();
    },this) );
  },
  
  selectLeaf: function(leaf) {
    this.model = leaf;
    this.render();
  },
    
  onSelectTab: function(event) {
    var tabID = event.currentTarget.id;
    var tab = _.find( this.tabs, function(tab) { return tab.id == tabID });
    this.selectTab(tab);
  },

  onClose: function(event) {
    var tabID = $(event.currentTarget).attr('data-tab-id');
    var tab = _.find( this.tabs, function(tab) { return tab.id == tabID });
    this.closeTab(tab);
  },
  
  newTranscription: function() {  
    var documentID = this.model.get('document_id');
    var transcription = new TextLab.Transcription({ 
      leaf_id: this.model.id, 
      name: 'untitled',
      document_id: documentID, 
      shared: false, 
      submitted: false,
      published: false,
      owner: true
    });
    this.collection.add( transcription );
    return transcription;
  },
  
  onAddTab: function() {
    // TODO bring up the transcription dialog
    var transcription = this.newTranscription();
    var tab = this.openXMLEditorTab(transcription);
    this.selectTab(tab);
  },
  
  resizeActivePanel: function() {    
    if( this.activeTab && this.parentPanel ) {
      var xmlEditorToolbar = this.$(".xml-editor-toolbar");
      this.activeTab.xmlEditor.editor.setSize( this.parentPanel.width(), this.parentPanel.height() - xmlEditorToolbar.height() - 30 );
      this.activeTab.xmlEditor.editor.refresh();
    }
  },
  
  selectTab: function(tab) {
    
    if( this.activeTab ) {
      var prevTabEl = this.$("#"+this.activeTab.id);  
      var prevTabPaneEl = this.$("#"+this.activeTab.id+'-pane');

      prevTabEl.removeClass('active');
      prevTabPaneEl.hide();
    }
    
    var tabEl = this.$("#"+tab.id);  
    var tabPaneEl = this.$("#"+tab.id+'-pane');
    
    tabEl.addClass('active');
    tabPaneEl.show();
    
    // update surface view
    this.surfaceView.syncZoneLinks( tab.transcription.zoneLinks.models );
    
    this.activeTab = tab;
    this.resizeActivePanel();
  },
  
  starTranscription: function( transcriptionID ) {
    _.each( this.tabs, function( tab ) {
      tab.transcription.set('published', ( tab.transcription.id == transcriptionID ));
      tab.xmlEditor.save( _.bind( function() {
        this.updateTabStar(tab);        
      }, this));
    }, this);
  },
  
  unStarTranscription: function( transcriptionID ) {
    var tab = _.find( this.tabs, function(tab) { return tab.transcription.id == transcriptionID } );
    tab.transcription.set('published', false );
    tab.xmlEditor.save( _.bind( function() {
      this.updateTabStar(tab);        
    }, this));    
  },
  
  updateTabStar: function(tab) {
    var starEl = this.$("#"+tab.id+" i");  
    if( tab.transcription.get('published') ) {
      starEl.addClass('fa fa-star');
      tab.xmlEditor.togglePublishButton(false);
    } else {
      starEl.removeClass('fa fa-star');
      tab.xmlEditor.togglePublishButton(true);
    }    
  },
    
  closeTab: function(tab) {
    tab.xmlEditor.save( _.bind( function() {

      this.tabs = _.without(this.tabs, tab);      

      // if we're on the closing tab, switch tabs 
      if( this.activeTab == tab ) {
        if( this.tabs.length > 0 ) {
          this.selectTab(_.first(this.tabs));
        } else {
          this.activeTab = null;
        }
      }

      this.$("#"+tab.id).detach();
      this.$("#"+tab.id+'-pane').detach();

    }, this));
  },
    
  openXMLEditorTab: function(transcription) {    
    var xmlEditor = new TextLab.XMLEditor({ model: transcription, leaf: this.model, tabbedEditor: this });
    xmlEditor.render();

    var tab = { 
      id: 'tab-'+transcription.cid, 
      name: transcription.get('name'),
      star: transcription.get('published'),
      xmlEditor: xmlEditor,
      transcription: transcription
    };
    
    var tabPaneID = tab.id+'-pane';
    this.$(".tabs").append( this.partials.tab(tab) );
    this.$(".tab-panes").append( this.partials.tabPane({ id: tabPaneID }) );
    
    var tabPaneEl = this.$("#"+tabPaneID);
    tabPaneEl.append( xmlEditor.$el );
    
    tab.xmlEditor.initEditor();
    tab.xmlEditor.setSurfaceView(this.surfaceView);

    // it isn't visible by default
    tabPaneEl.hide();

    this.tabs.push(tab);
    
    return tab;
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