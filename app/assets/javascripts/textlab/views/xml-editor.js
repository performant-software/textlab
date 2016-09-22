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
    'click .zone-link': 'onClickZoneLink'
  },
  
	autoSaveDelay: 1000,
  
            	
	initialize: function(options) {
    _.bindAll( this, "onEnter", "requestAutosave", "save");
    this.lbTag = TextLab.Tags['lb'];
    this.lbEnabled = false;
    this.leaf = options.leaf;
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
      var zoneLabel = doc.getRange(markRange.from, markRange.to);
      var offset = doc.indexFromPos( markRange.from );
      var zoneLink = new TextLab.ZoneLink({ 
        offset: offset, 
        zone_label: zoneLabel, 
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
  
  selectLeaf: function( leaf ) {
    this.model = leaf;
    var content = this.model.get('content') ? this.model.get('content') : "";
    var newDoc = CodeMirror.Doc( content, "xml" );
    this.editor.swapDoc( newDoc );
    this.initZoneLinks();
		newDoc.clearHistory();
  },
  
  markZoneLink: function( offset, broken ) {
    var endIndex = offset + 4; // format is always four chars long
    var doc =  this.editor.getDoc();
    var position = doc.posFromIndex(offset);
    var endPos = doc.posFromIndex(endIndex);
    var cssClass = broken ? 'broken-zone-link' : 'zone-link';
    return doc.markText( position, endPos, { className: cssClass, atomic: true } ); 
  },
  
  // TODO refactor
  onClickZoneLink: function(e) {
    var zoneLabel = $(e.currentTarget).html();
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
    this.$el.html(this.template({ tags: _.keys( TextLab.Tags ) })); 
  },
  
  initEditor: function() {
    var editorEl = this.$("#codemirror").get(0);
		this.editor = CodeMirror.fromTextArea( editorEl, {
        mode: "xml",
        lineNumbers: true,
        lineWrapping: true
		});    
    
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