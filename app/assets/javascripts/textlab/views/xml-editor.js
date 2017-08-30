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
    _.bindAll( this, "onEnter", "requestAutosave", "save", "onDrop");
    this.lbEnabled = false;
    this.leaf = options.leaf;
    this.config = options.config;

    // tags with special behaviors
    this.lbTag = this.config.tags['lb'];
    this.pbTag = this.config.tags['pb'];

    this.tabbedEditor = options.tabbedEditor;
  },

  onDrop: function(cm,dragEvent) {

    // don't proceed if transcription is read only
    if( this.model.isReadOnly(this.tabbedEditor.projectOwner) ) return false;

    // if a file was dropped
    if( dragEvent.dataTransfer.files ) {
      var filename = dragEvent.dataTransfer.files[0].name;
      var parts = filename.split('.');
      if( parts.length > 1 ) {
        var partsMinusExt = _.first( parts, parts.length - 1 );
        filename = partsMinusExt.join('.');
      }

      // rename this transcription based on this filename.
      this.model.set('name', filename);
      this.save( _.bind( function() {
        this.tabbedEditor.renameTab( 'transcription', this.model.id, filename );
      }, this));
    }
  },

  activateTagDialog: function( tagID, zone ) {

    var tag = this.config.tags[tagID];
        
    if( tag.attributes ) {    
      var onCreateCallback = _.bind(function(attributes, children) {
        this.generateTag(tag,attributes,children);
      }, this);
            
      var attributeModalDialog = new TextLab.AttributeModalDialog({ 
        model: this.leaf, 
        config: this.config, 
        zone: zone, 
        tag: tag, 
        callback: onCreateCallback 
      });
      attributeModalDialog.render();
    } else {
      this.generateTag(tag);
    }     

  },
  
  onClickTagMenuItem: function(event) {
    var target = $(event.currentTarget); 
    var tagID = target.attr("data-tag-id");   

    // are we coming from drop down? if so, hide it
    if( !target.hasClass('toolbar-button')) {
      this.$('#xml-tag-dropdown').dropdown('toggle');
    }

    this.activateTagDialog( tagID );

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
    if( this.pbTag ) {
      var attrString = this.pbTagAttrTemplate({ xml_id: this.leaf.get('xml_id') });
      var attributes = { attrString: attrString };
      this.generateTag(this.pbTag, attributes);
      return false;
    }
  },
  
  onClickPreview: function() {
    if( this.model.id ) {
      window.open("/transcriptions/"+this.model.id,'_blank');
    } else {
      alert( "This transcription is blank or could not be saved, unable to preview.")
    }
  },
  
  onClickPublish: function() {
    this.tabbedEditor.starTab( 'transcription', this.model.id );
  },
  
  onClickUnPublish: function() {
    this.tabbedEditor.unStarTab( 'transcription', this.model.id );
  },
  
  onClickShare: function() {
    this.updateSharing( true );
    return false;
  },
  
  onClickStopSharing: function() {
    this.updateSharing( false );
    return false;
  },
  
  onConfigChanged: function(config) {
    this.config = config;
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
      this.tabbedEditor.submitTab( 'transcription', this.model );
    }
    
    return false;
  },
  
  onClickReturn: function() {
    this.$('#action-dropdown').dropdown('toggle');

    var returnConfirmed = confirm("Do you wish to return this transcription to its owner?");
    
    if( returnConfirmed ) {
      this.tabbedEditor.returnTab( 'transcription', this.model );
    }
    
    return false;
  },
  
  onClickRename: function() {
    var onUpdateCallback = _.bind(function() {
      this.save( _.bind( function() {
        this.tabbedEditor.renameTab( 'transcription', this.model.id, this.model.get('name'));        
      }, this));
    }, this);  
    
    var transcriptionDialog = new TextLab.TabDialog( { model: this.model, callback: onUpdateCallback, mode: 'edit' } );
    transcriptionDialog.render();    
    return false;   
  },

  onClickDelete: function() {
    this.$('#action-dropdown').dropdown('toggle');
    
    var deleteConfirmed = confirm("Do you wish to delete the transcription titled '"+this.model.get('name')+"'? ");
    
    if( deleteConfirmed ) {
      this.tabbedEditor.deleteTab( 'transcription', this.model );
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
    if( this.lbEnabled && this.lbTag ) {
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

  getSelection: function() {
    var doc = this.editor.getDoc();
    return doc.getSelection();
  },

  generateTag: function(tag, attributes, children) {
    var doc =  this.editor.getDoc();
    var from = doc.getCursor("from");
    var to = doc.somethingSelected() ? doc.getCursor("to") : null;

    if( children && children.length > 0 ) {
      // for child tags - put down first tag with optional selection
      // then put down n more tags (no selection)
      var childFrom = from;
      var childTo = to;
      _.each( children, function( child ) {
        var tagEnd = this.generateSingleTag( child.tag, child, childFrom, childTo );
        childFrom = tagEnd;
        childTo = null;
      }, this);

      // parent will encompass all children that were inserted.
      to = childFrom;
    }

    this.generateSingleTag( tag, attributes, from, to );
    this.editor.focus();
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
    
    var endIndex = doc.indexFromPos(from) + insertion.length;
    return doc.posFromIndex(endIndex);
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
    var showTags = !this.model.isReadOnly(this.tabbedEditor.projectOwner);    
    
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

    var dropDownTags = [];
    _.each( this.config.tags, function( tag, key ) {
      if( tag.omitFromMenu != true ) {
        dropDownTags.push( key );
      }
    });
              
    this.$el.html(this.template({ 
      tags: dropDownTags,   
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
    
    var readOnly = this.model.isReadOnly(this.tabbedEditor.projectOwner);
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

    this.editor.on('drop', this.onDrop );
    
    // save as we go
    this.editor.on( "change", this.requestAutosave );
        
  }  
  
});