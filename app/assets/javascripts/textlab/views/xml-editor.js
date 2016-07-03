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
    'click .facs-ref': 'onClickImageLink'
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
            
      var attributeModalDialog = new TextLab.AttributeModalDialog( { tag: tag, callback: onCreateCallback } );
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
    // TODO this.model.save();
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
    var insertion;
    var doc =  this.editor.getDoc();
    
    if( tag.empty ) {
      insertion = this.emptyTagTemplate({ tag: tag.tag, attributes: attributes });
    } else {
      var openTag = this.openTagTemplate({ tag: tag.tag, attributes: attributes });
      var body = doc.getSelection();
      var closeTag = this.closeTagTemplate(tag);
      insertion = openTag + body + closeTag;
    }
    
    // if a range is selected, replace it. Otherwise, insert at caret.
    if( doc.somethingSelected() && !tag.empty ) {
      doc.replaceSelection(insertion);
    } else {
      var caretPosition = doc.getCursor();
      doc.replaceRange(insertion, caretPosition );
    }
    
    this.editor.focus();
  },
  
  insertImageLink: function() {
    // insert tag at caret
    var doc =  this.editor.getDoc();
    var caretPosition = doc.getCursor();
    var facsID = "image5";
    doc.replaceRange("image5", caretPosition );
    var endIndex = doc.indexFromPos(caretPosition) + facsID.length;
    var endPos = doc.posFromIndex(endIndex);
    doc.markText( caretPosition, endPos, { className: "facs-ref", atomic: true } );        
  },
  
  onClickImageLink: function() {
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
    
		// Undo (ctrl-z) history starts now 
		this.editor.getDoc().clearHistory();
    
    this.$el.keydown( _.bind( function (e){
        if(e.keyCode == 13) { 
          this.onEnter();
        }
    }, this));
    
    // save as we go
    this.editor.on( "change", this.requestAutosave );
        
  }  
  
});