TextLab.TabbedEditor = Backbone.View.extend({
    
	template: JST['textlab/templates/tabbed-editor'],
  
  id: 'tabbed-editor',
  
  maxStartingTabs: 3,
  
	partials: {
		tab: JST['textlab/templates/common/tab'],
		tabPane: JST['textlab/templates/common/tab-pane']
	},
  
  events: {
    'click .doc-tab': 'onSelectTab',
    'click .close-x': 'onClose',
    'click .new-tab-button': 'onNew',
    'click .open-tab-button': 'onOpen'
  },
                	
	initialize: function(options) {
    this.parentPanel = options.parentPanel;
    this.projectOwner = options.projectOwner;
    this.config = options.config;
    _.bindAll( this, "initTranscriptions" );
  },
  
  initTranscriptions: function( callback ) {   
    if( !this.model ) return;
     
    this.model.getTranscriptions( _.bind( function( transcriptions ) {
      this.transcriptions = transcriptions;
      this.transcriptions.models = _.sortBy( this.transcriptions.models, function(t) { t.get('name') });
      
      // if there are no transcriptions, create a blank one
      if(this.transcriptions.models.length == 0) {
        var transcription = TextLab.Transcription.newTranscription(this.model.get('document_id'));
        this.transcriptions.add( transcription );
      }
    
      callback();
    },this) );
  },
  
  initSequences: function( callback ) {   
    if( !this.model ) return;
     
    this.model.getSequences( _.bind( function( sequences ) {
      this.sequences = sequences;
      this.sequences.models = _.sortBy( this.sequences.models, function(t) { t.get('name') });
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

  onConfigChanged: function(config) {
    this.config = config;
    _.each( this.tabs, function(tab) {
      tab.xmlEditor.onConfigChanged(config);
    }, this);
    this.render();
  },

  onClose: function(event) {
    var tabID = $(event.currentTarget).attr('data-tab-id');
    var tab = _.find( this.tabs, function(tab) { return tab.id == tabID });
    this.closeTab(tab);
    return false;
  },
  
  deleteTab: function( tabType, editorModel ) {
    var tab = this.getTab( tabType, editorModel.id );
    editorModel.destroy({ success: _.bind( function() {
      this.closeTab(tab,true);
    }, this)});
  },
  
  submitTranscription: function( transcription ) {
    var tab = _.find( this.tabs, function(tab) { return tab.transcription.id == transcription.id });
    transcription.set( 'submitted', true );
    this.closeTab(tab);
  },

  returnTranscription: function( transcription ) {
    var tab = _.find( this.tabs, function(tab) { return tab.transcription.id == transcription.id });
    transcription.set( 'submitted', false );
    this.closeTab(tab);
  },
  
  onNew: function() {    
    var onCreateCallback = _.bind(function(editorModel, editorType) {
      if( editorType == 'transcription' ) {
        this.transcriptions.add(editorModel);
        editorModel.save(null, { success: _.bind( function() {
          var tab = this.openXMLEditorTab(editorModel);
          this.selectTab(tab);
        }, this) });
      } else {
        this.sequences.add(editorModel);
        editorModel.save(null, { success: _.bind( function() {
          var tab = this.openSequenceEditorTab(editorModel);
          this.selectTab(tab);
        }, this) });
      }
    }, this);  
    
    var tabDialog = new TextLab.TabDialog( { leaf: this.model, callback: onCreateCallback } );
    tabDialog.render();   
  },
  
  onOpen: function() {    
    var onSelectCallback = _.bind( function(tabModel,tabType) {
      var tab = ( tabType == 'transcription') ? this.openXMLEditorTab(tabModel) : this.openSequenceEditorTab(tabModel);
      this.selectTab(tab);
    }, this);  
    
    // make a list of the unopened transcriptions
    var openTranscriptions = _.compact( _.map( this.tabs, function( tab ) { return tab.transcription } ));
    var availableTranscriptions = _.difference( this.transcriptions.models, openTranscriptions );

    // make a list of the unopened sequences
    var openSequences = _.compact( _.map( this.tabs, function( tab ) { return tab.sequence } ));
    var availableSequences = _.difference( this.sequences.models, openSequences );
    
    var openTabDialog = new TextLab.OpenTabDialog( { 
      transcriptions: availableTranscriptions, 
      sequences: availableSequences, 
      callback: onSelectCallback 
    });
    openTabDialog.render();   
  },
  
  resizeActivePanel: function() {    
    if( this.activeTab && this.parentPanel ) {
      if(  this.activeTab.xmlEditor ) {
        var xmlEditorToolbar = this.$(".xml-editor-toolbar");
        this.activeTab.xmlEditor.editor.setSize( this.parentPanel.width(), this.parentPanel.height() - xmlEditorToolbar.height() - 100 );
        this.activeTab.xmlEditor.editor.refresh();        
      } else {
        var sequenceEditorToolbar = this.$(".sequence-editor-toolbar");
        var sequenceEditor = this.$("#sequence-grid");
        sequenceEditor.width(this.parentPanel.width() - 10);
        sequenceEditor.height(this.parentPanel.height() - sequenceEditorToolbar.height() - 100 );
      }
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
    if( tab.transcription ) {
      this.surfaceView.syncZoneLinks( tab.transcription.zoneLinks.models );
    }
    
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
  
  renameTab: function( tabType, modelID, newName ) {
    var tab = this.getTab( tabType, modelID );
    var nameSpan = this.$("#"+tab.id+' .name');
    nameSpan.html(newName);
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
    
  closeTab: function(tab, dontSave ) {
    
    var closeTab = _.bind( function() {

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

    }, this);
    
    if( dontSave ) {
      closeTab();
    } else {
      if( tab.xmlEditor ) {
        tab.xmlEditor.save( closeTab );        
      } else {
        closeTab();
      }
    }
  },

  getTab: function( tabType, id ) {
    var tabID = tabType+'-tab-'+id;
    return _.find( this.tabs, function(tab) { return tab.id == tabID; });
  },
    
  openXMLEditorTab: function(transcription) {    
    var xmlEditor = new TextLab.XMLEditor({ model: transcription, leaf: this.model, config: this.config, tabbedEditor: this });
    xmlEditor.render();

    var tab = { 
      id: 'transcription-tab-'+transcription.id, 
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

  openSequenceEditorTab: function(sequence) {
    var sequenceEditor = new TextLab.SequenceEditor({ 
      model: sequence, 
      leaf: this.model, 
      tabbedEditor: this,
      surfaceView: this.surfaceView,
    });
    sequenceEditor.render();

    var tab = { 
      id: 'sequence-tab-'+sequence.id, 
      name: sequence.get('name'),
      star: sequence.get('published'),
      sequenceEditor: sequenceEditor,
      sequence: sequence
    };
    
    var tabPaneID = tab.id+'-pane';
    this.$(".tabs").append( this.partials.tab(tab) );
    this.$(".tab-panes").append( this.partials.tabPane({ id: tabPaneID }) );
    
    var tabPaneEl = this.$("#"+tabPaneID);
    tabPaneEl.append( sequenceEditor.$el );
    
    // it isn't visible by default
    tabPaneEl.hide();

    this.tabs.push(tab);
    
    return tab;
  },
      
  render: function() {
    
    this.tabs = [];
    
    // TODO start with loading spinner active
    this.$el.html(this.template()); 

    var loadingComplete = _.bind( function() {
      _.each( _.first( this.transcriptions.models, this.maxStartingTabs), function( transcription ) {
        this.openXMLEditorTab(transcription);
      }, this );

      // select the first tab initially
      if( this.tabs.length > 0 ) {
        this.selectTab(_.first(this.tabs));
      }
    }, this );
    
    // after init transcriptions, init sequences, then loading complete
    this.initTranscriptions( _.bind( this.initSequences, this, loadingComplete ) );

  },
  
  postRender: function(surfaceView) {
    this.surfaceView = surfaceView;
  }
  
  
});