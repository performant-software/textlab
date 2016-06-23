TextLab.XMLEditor = Backbone.View.extend({
    
	template: JST['textlab/templates/xml-editor'],
  facsTemplate: _.template("<span class='facs-ref' id='<%= id %>'><%= name %></span>"),
  openTagTemplate: _.template("<<%= tag %> <%= attributes %>>"),
  closeTagTemplate: _.template("</<%= tag %>>"),
  emptyTagTemplate: _.template("<<%= tag %> <%= attributes %>/>"),
  
  id: 'xml-editor',
  
  events: {
    'click .tag-menu-item': 'onClickTagMenuItem',
    'click .facs-ref': 'onClickImageLink'
  },
            	
	initialize: function(options) {
  },
  
  // milestone: {
  //   tag: 'milestone',
  //   empty: true,
  //   attributes: {
  //     unit: { displayName: 'Unit', fieldType: 'vocab', vocab: ['Clip', 'Mount', 'Leaf'] },
  //     number: { displayName: 'Number', fieldType: 'number' }
  //   }
  // }
  
  onClickTagMenuItem: function(event) {
    var tagID = $(event.currentTarget).attr("data-tag-id");		
    var tag = TextLab.Tags[tagID];

    var doc =  this.editor.getDoc();
    
    // the string to insert into the editor
    var insertion;
    var attributeString = "";
    
    if( tag.attributes ) {
      // TODO dialog to ask user for attributes
      attributeString = this.generateAttributes( tag );
    }
    
    if( tag.empty ) {
      insertion = this.emptyTagTemplate({ tag: tag.tag, attributes: attributeString });
    } else {
      var openTag = this.openTagTemplate({ tag: tag.tag, attributes: attributeString });
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
  
  generateAttributes: function( tag ) {    
    var attributeString = 'id="foo"';    
    return attributeString;
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
  }  
  
});