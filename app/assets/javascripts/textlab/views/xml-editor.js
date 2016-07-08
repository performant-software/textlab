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
  },
  
  onClickTagMenuItem: function(event) {    
    var tagID = $(event.currentTarget).attr("data-tag-id");		
    var tag = TextLab.Tags[tagID];
        
    if( tag.attributes ) {    
      var onCreateCallback = _.bind(function(attributes) {
        this.generateTag(tag,attributes);
      }, this);
            
      var attributeModalDialog = new TextLab.AttributeModalDialog( { model: this.model, tag: tag, callback: onCreateCallback } );
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
  
  save: function() {
    var doc = this.editor.getDoc();    
    var marks = doc.getAllMarks();

    // convert marks into zone links
    var zoneLinks = _.map( marks, _.bind(function(mark) {
      var markRange = mark.find();
      var zoneLabel = doc.getRange(markRange.from, markRange.to);
      var offset = doc.indexFromPos( markRange.from );
      var zoneLink = new TextLab.ZoneLink({ offset: offset, zone_label: zoneLabel, leaf_id: this.model.id });
      return zoneLink;
    }, this));

    // reset to latest zone links
    this.model.zoneLinks.reset(zoneLinks);
    this.model.set("content",doc.getValue());
    this.model.save();
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
    
    if( tag.empty ) {
      insertion = this.emptyTagTemplate({ tag: tag.tag, attributes: attributes.attrString });
    } else {
      var openTag = this.openTagTemplate({ tag: tag.tag, attributes: attributes.attrString });
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
    if( attributes.zoneOffset ) {
      var elementStart = "<"+tag.tag;
      var offset = doc.indexFromPos(startPos) + elementStart.length + attributes.zoneOffset;
      this.markZoneLink(offset);
    }
    
    this.editor.focus();
  },
  
  markZoneLink: function( offset ) {
    var endIndex = offset + 4; // format is always four chars long
    var doc =  this.editor.getDoc();
    var position = doc.posFromIndex(offset);
    var endPos = doc.posFromIndex(endIndex);
    doc.markText( position, endPos, { className: "zone-link", atomic: true } );        
  },
  
  onClickZoneLink: function() {
    // TODO
    return false;
  },
      
  render: function() {      
    this.$el.html(this.template({ tags: _.keys( TextLab.Tags ) })); 
  },
  
  initEditor: function() {
    var editorEl = this.$("#codemirror").get(0);
		this.editor = CodeMirror.fromTextArea( editorEl, {
        mode: "xml",
        lineNumbers: true
		});    
    
    var doc = this.editor.getDoc();    
    if( this.model.get('content')  ) {
      doc.setValue( this.model.get('content') );
    }
    
    _.each( this.model.zoneLinks.models, function( zoneLink ) {
      this.markZoneLink(zoneLink.get('offset'));
    }, this);
    
		// Undo (ctrl-z) history starts now 
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