TextLab.XMLEditor = Backbone.View.extend({
    
	template: JST['textlab/templates/xml-editor'],
  facsTemplate: _.template("<span class='facs-ref' id='<%= id %>'><%= name %></span>"),
  openTagTemplate: _.template("<<%= tag %><%= attributes %>>"),
  closeTagTemplate: _.template("</<%= tag %>>"),
  emptyTagTemplate: _.template("<<%= tag %><%= attributes %>/>"),
  pbTagAttrTemplate: _.template(" facs='#<%= xml_id %>'" ),
  
  id: 'xml-editor',
  
  events: {
    'click .lb-mode-button': 'onClicklbMode',
    'click .pb-button': 'onClickpbMode',
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
  
  onClickpbMode: function() { 
    var tag = TextLab.Tags['pb'];
    var attrString = this.pbTagAttrTemplate({ xml_id: this.leaf.get('xml_id') });
    var attributes = { attrString: attrString };
    this.generateTag(tag, attributes);
    return false;
  },
  
  onClickPreview: function() {
    if( this.model.id ) {
      window.open("/transcriptions/"+this.model.id,'_blank');
    } else {
      alert( "This transcription is blank or could not be saved, unable to preview.")
    }
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
    this.$('#action-dropdown').dropdown('toggle');

    var submitConfirmed = confirm("Do you wish to submit this transcription for publication?");
    
    if( submitConfirmed ) {
      this.tabbedEditor.submitTranscription( this.model );
    }
    
    return false;
  },
  
  onClickReturn: function() {
    this.$('#action-dropdown').dropdown('toggle');

    var returnConfirmed = confirm("Do you wish to return this transcription to its owner?");
    
    if( returnConfirmed ) {
      this.tabbedEditor.returnTranscription( this.model );
    }
    
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

  generateCompoundTag: function() {
    // for multitag - put down first tag, then move to the end, put down second tag (no selection), then move to begining 
    // and put down wrapping tag. (make it work for n tags)

  },

  // what are the correct inputs for this method?
  generateTag: function(tag, attributes) {
    var doc =  this.editor.getDoc();

    // TODO calls either compound tag or single tag
    
    var from = doc.getCursor("from");
    var to = doc.somethingSelected() ? doc.getCursor("to") : null;

    this.generateSingleTag( tag, attributes, from, to );
  },

  generateSingleTag: function(tag, attributes, from, to) {
    var insertion;
    var doc =  this.editor.getDoc();
    var attrString = attributes ? attributes.attrString : "";
    
    if( tag.empty ) {
      insertion = this.emptyTagTemplate({ tag: tag.tag, attributes: attrString });
    } else {
      var openTag = this.openTagTemplate({ tag: tag.tag, attributes: attrString });
      var body = "";
      // only need to populate body if insertion is a range.
      if( to ) {
        body = doc.getRange(from,to);
        var existingMarks = doc.findMarks(from,to);
        var existingMarkOffsets = _.map( existingMarks, function( existingMark ) {
          var markPos = existingMark.find();
          return doc.indexFromPos(markPos.from) + openTag.length;
        }, this );
      } 
      var closeTag = this.closeTagTemplate(tag);
      insertion = openTag + body + closeTag;
    }
    
    // if a range is selected, replace it. Otherwise, insert at caret.
    doc.replaceRange(insertion, from, to);
    
    // need to know insertion point + offset into insertion where link appears. 
    if( attributes && attributes.zoneOffset ) {
      var elementStart = "<"+tag.tag;
      var offset = doc.indexFromPos(from) + elementStart.length + attributes.zoneOffset;      
      var zoneMark = this.markZoneLink(offset);
      var markRange = zoneMark.find();
      var zoneLabel = doc.getRange(markRange.from, markRange.to);
      this.surfaceView.toggleZoneLink( zoneLabel, true );
    }

    // repair any existing marks
    _.each( existingMarkOffsets, function( existingMarkOffset ) {
      this.markZoneLink(existingMarkOffset);
    }, this);
    
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
    
    var showPublishButton = this.tabbedEditor.projectOwner;
    var showSubmitButton = !this.tabbedEditor.projectOwner;
    var showReturnButton = (this.tabbedEditor.projectOwner && this.model.get('submitted'));
    var showActionMenu = (this.model.get('owner') && !this.model.get('submitted'));
    var showTags = !this.model.isReadOnly();    
    
    var statusMessage = "";
    if( this.model.get('submitted') ) {
      if( this.tabbedEditor.projectOwner ) {
        statusMessage = "Transcription submitted by: username."
      } else {
        statusMessage = "Transcription submitted for publication."
      }
    } else if( this.model.get('shared') && this.model.isReadOnly() ) {
      statusMessage = "Transcription shared by: username";
    }

    var actionWidthClass = '';
    if( showActionMenu ) {
      if( showPublishButton ) {
        actionWidthClass = 'room-for-action-and-publish';
      } else {
        actionWidthClass = 'room-for-action-menu';
      }
    }
    if( showReturnButton ) {
      actionWidthClass = 'room-for-return-button';
    }
              
    this.$el.html(this.template({ 
      tags: _.keys( TextLab.Tags ),   
      showPublishButton: showPublishButton,
      showSubmitButton: showSubmitButton,
      showReturnButton: showReturnButton,
      showActionMenu: showActionMenu, 
      published: this.model.get('published'),
      submitted: this.model.get('submitted'),
      shared: this.model.get('shared'),
      showTags: showTags,
      statusMessage: statusMessage,
      actionWidthClass: actionWidthClass
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