TextLab.XMLEditor = Backbone.View.extend({
    
	template: JST['textlab/templates/xml-editor'],
  facsTemplate: _.template("<span class='facs-ref' id='<%= id %>'><%= name %></span>"),
  openTagTemplate: _.template("<<%= tag %><%= attributes %>>"),
  closeTagTemplate: _.template("</<%= tag %>>"),
  emptyTagTemplate: _.template("<<%= tag %><%= attributes %>/>"),
  
  id: 'xml-editor',
  
  events: {
    'click .lb-mode-button': 'onClicklbMode',
    'click .tag-menu-item': 'onClickTagMenuItem',
    'click .zone-link': 'onClickZoneLink',
    'click .preview-button': 'onClickPreview',
    'click .publish-button': 'onClickPublish',
    'click .unpublish-button': 'onClickUnPublish',
    'click .share-button': 'onClickShare',
    'click .stop-sharing-button': 'onClickStopSharing',
    'click .submit-button': 'onClickSubmit',
    'click .return-button': 'onClickReturn',
    'click .rename-button': 'onClickRename',
    'click .delete-button': 'onClickDelete'
  },
  
	autoSaveDelay: 1000,
  
            	
	initialize: function(options) {
    _.bindAll( this, "onEnter", "requestAutosave", "save");
    this.lbTag = TextLab.Tags['lb'];
    this.lbEnabled = false;
    this.leaf = options.leaf;
    this.tabbedEditor = options.tabbedEditor;
  },
  
  onClickTagMenuItem: function(event) {
    var target = $(event.currentTarget); 
    var tagID = target.attr("data-tag-id");		
    var tag = TextLab.Tags[tagID];
      
    // are we coming from drop down? if so, hide it
    if( !target.hasClass('toolbar-button')) {
      this.$('#xml-tag-dropdown').dropdown('toggle');
    }
        
    if( tag.attributes ) {    
      var onCreateCallback = _.bind(function(attributes) {
        this.generateTag(tag,attributes);
      }, this);
            
      var attributeModalDialog = new TextLab.AttributeModalDialog( { model: this.leaf, zone: event.zone, tag: tag, callback: onCreateCallback } );
      attributeModalDialog.render();
    } else {
      this.generateTag(tag);
    }     
    
    return false;
  },
  
  onClicklbMode: function() { 
    var lbModeButton = this.$('.lb-mode-button');

    if( this.lbEnabled ) {
      lbModeButton.removeClass('active');
      this.lbEnabled = false;      
    } else {
      lbModeButton.addClass('active');
      this.lbEnabled = true
    }    
    this.editor.focus();
    return false;
  },
  
  onClickPreview: function() {
    window.open("/transcriptions/"+this.model.id,'_blank');
  },
  
  onClickPublish: function() {
    this.tabbedEditor.starTranscription( this.model.id );
    
  },
  
  onClickUnPublish: function() {
    this.tabbedEditor.unStarTranscription( this.model.id );
  },
  
  onClickShare: function() {
    this.updateSharing( true );
    return false;
  },
  
  onClickStopSharing: function() {
    this.updateSharing( false );
    return false;
  },
  
  updateSharing: function( shared ) {
    this.$('#action-dropdown').dropdown('toggle');
    this.model.set('shared', shared );
    
    this.save( _.bind( function() {
      var shareButton = this.$('.share-button');
      var stopShareButton = this.$('.stop-sharing-button');
      
      if( shared ) {
        shareButton.addClass('hidden');
        stopShareButton.removeClass('hidden');
      } else {
        stopShareButton.addClass('hidden');
        shareButton.removeClass('hidden');
      }      
    }, this));    
  },

  onClickSubmit: function() {    
    // TODO
    this.$('#action-dropdown').dropdown('toggle');
    this.model.set('submitted', true );
    return false;
  },
  
  onClickReturn: function() {
    // TODO
    this.$('#action-dropdown').dropdown('toggle');
    this.model.set('submitted', false );
    return false;
  },
  
  onClickRename: function() {
    var onUpdateCallback = _.bind(function() {
      this.save( _.bind( function() {
        this.tabbedEditor.renameTranscription( this.model.id, this.model.get('name'));        
      }, this));
    }, this);  
    
    var transcriptionDialog = new TextLab.TranscriptionDialog( { model: this.model, callback: onUpdateCallback, mode: 'edit' } );
    transcriptionDialog.render();    
    return false;   
  },

  onClickDelete: function() {
    this.$('#action-dropdown').dropdown('toggle');
    
    var deleteConfirmed = confirm("Do you wish to delete the transcription titled '"+this.model.get('name')+"'? ");
    
    if( deleteConfirmed ) {
      this.tabbedEditor.deleteTranscription( this.model );
    }
    
    return false;
  },
  
  togglePublishButton: function( buttonState ) {
    if( buttonState ) {
      this.$('.unpublish-button').addClass('hidden');
      this.$('.publish-button').removeClass('hidden');
    } else {
      this.$('.publish-button').addClass('hidden');
      this.$('.unpublish-button').removeClass('hidden');
    }
  },
  
  onEnter: function() {
    if( this.lbEnabled ) {
      this.generateTag(this.lbTag);
    }    
  },
    
  save: function( callback ) {
    var doc = this.editor.getDoc();    
    var marks = doc.getAllMarks();

    // convert marks into zone links
    var zoneLinks = _.map( marks, _.bind(function(mark) {
      var markRange = mark.find();
      var xmlZoneLabel = doc.getRange(markRange.from, markRange.to);
      var offset = doc.indexFromPos( markRange.from );
      var zoneLink = new TextLab.ZoneLink({ 
        offset: offset, 
        zone_label: this.leaf.removeZoneLabelPrefix(xmlZoneLabel), 
        transcription_id: this.model.id, 
        leaf_id: this.leaf.id 
      });
      return zoneLink;
    }, this));

    // reset to latest zone links
    this.model.zoneLinks.reset(zoneLinks);
    this.model.set("content",doc.getValue());
    
    
    var onError = function() {
      $('.error-message').html('ERROR: Unable to save changes.');
      TextLab.Routes.routes.onError();
    };
  
    var onSuccess = function() {
      $('.error-message').html('');
      if( callback ) {
        callback();
      }
    };
    
    this.model.save(null, { success: onSuccess, error: onError });
  },  
  
	startAutosaveTimer: function() {
		// start a timer
		this.autoSaveTimerID = window.setTimeout( this.save, this.autoSaveDelay );
	},
	
	requestAutosave: function() {
		this.stopAutosaveTimer();
		this.startAutosaveTimer();	
	},
	
	stopAutosaveTimer: function() {
		// clear the current timer 		
		window.clearTimeout( this.autoSaveTimerID );	
	},
    
  generateTag: function(tag, attributes) {
    var insertion, startPos;
    var doc =  this.editor.getDoc();
    var attrString = attributes ? attributes.attrString : "";
    
    if( tag.empty ) {
      insertion = this.emptyTagTemplate({ tag: tag.tag, attributes: attrString });
    } else {
      var openTag = this.openTagTemplate({ tag: tag.tag, attributes: attrString });
      var body = doc.getSelection();
      var closeTag = this.closeTagTemplate(tag);
      insertion = openTag + body + closeTag;
    }

    // note the start position of the insertion
    startPos = doc.getCursor("from");
    
    // if a range is selected, replace it. Otherwise, insert at caret.
    if( doc.somethingSelected() && !tag.empty ) {
      doc.replaceSelection(insertion);
    } else {
      doc.replaceRange(insertion, startPos );
    }
    
    // need to know insertion point + offset into insertion where link appears. 
    if( attributes && attributes.zoneOffset ) {
      var elementStart = "<"+tag.tag;
      var offset = doc.indexFromPos(startPos) + elementStart.length + attributes.zoneOffset;      
      var zoneMark = this.markZoneLink(offset);
      var markRange = zoneMark.find();
      var zoneLabel = doc.getRange(markRange.from, markRange.to);
      this.surfaceView.toggleZoneLink( zoneLabel, true );
    }
    
    this.editor.focus();
  },
  
  removeZoneLink: function( removedZone ) {
    var doc = this.editor.getDoc();    
    var marks = doc.getAllMarks();
    
    _.each( marks, _.bind(function(mark) {
      var markRange = mark.find();
      var zoneLabel = doc.getRange(markRange.from, markRange.to);
      if( zoneLabel == removedZone ) {
        // clear the old one and add a new one that's red.
        var delOffset = doc.indexFromPos(markRange.from);
        mark.clear();
        this.markZoneLink( delOffset, true );
      }
    }, this));
  },
  
  setSurfaceView: function( surfaceView ) {
    var doc = this.editor.getDoc();    
    var marks = doc.getAllMarks();
    
    // convert marks into zone links
    var zoneLinks = _.map( marks, _.bind(function(mark) {
      var markRange = mark.find();
      var zoneLabel = doc.getRange(markRange.from, markRange.to);

      mark.on( 'hide', _.bind(function() {
        this.surfaceView.toggleZoneLink( zoneLabel, false );
      },this));

      mark.on( 'unhide', _.bind(function() {
        this.surfaceView.toggleZoneLink( zoneLabel, true );
      },this));

    }, this));
    
    this.surfaceView = surfaceView;          
  },
  
  markZoneLink: function( offset, broken ) {
    var labelPrefix = this.leaf.getZoneLabelPrefix();
    var endIndex = offset + labelPrefix.length + 4; // format is always four chars long
    var doc =  this.editor.getDoc();
    var position = doc.posFromIndex(offset);
    var endPos = doc.posFromIndex(endIndex);
    var cssClass = broken ? 'broken-zone-link' : 'zone-link';
    return doc.markText( position, endPos, { className: cssClass, atomic: true } ); 
  },
  
  onClickZoneLink: function(e) {
    var xmlZoneLabel = $(e.currentTarget).html();
    var zoneLabel = this.leaf.removeZoneLabelPrefix(xmlZoneLabel);
    var zone = this.leaf.zones.getZoneByLabel(zoneLabel);
    this.surfaceView.selectZone( zone );
    return false;
  },
  
  initZoneLinks: function() {
    _.each( this.model.zoneLinks.models, function( zoneLink ) {
      var broken = this.leaf.isZoneLinkBroken(zoneLink);
      this.markZoneLink(zoneLink.get('offset'), broken);
    }, this);  
  },
      
  render: function() {      
    this.$el.html(this.template({ 
      tags: _.keys( TextLab.Tags ), 
      published: this.model.get('published'), 
      shared: this.model.get('shared'),
      submitted: this.model.get('submitted'),
      readOnly: this.model.isReadOnly(),
      owner: this.model.get('owner'),
      projectOwner: this.tabbedEditor.projectOwner
    })); 
  },
  
  initEditor: function() {
    
    var readOnly = this.model.isReadOnly();
    var editorEl = this.$("#codemirror").get(0);
		this.editor = CodeMirror.fromTextArea( editorEl, {
        mode: "xml",
        lineNumbers: true,
        lineWrapping: true,
        readOnly: readOnly
		});    
    
    if( readOnly ) {
      this.$(".CodeMirror").addClass('read-only');
      this.$(".CodeMirror-gutters").addClass('read-only');
    }
    
    var doc = this.editor.getDoc();    
    if( this.model && this.model.get('content')  ) {
      doc.setValue( this.model.get('content') );
    }
    
    if( this.model ) {
      this.initZoneLinks();
    }
		doc.clearHistory();
    
    this.$el.keydown( _.bind( function (e){
        if(e.keyCode == 13) { 
          this.onEnter();
        }
    }, this));
    
    // save as we go
    this.editor.on( "change", this.requestAutosave );
        
  }  
  
});