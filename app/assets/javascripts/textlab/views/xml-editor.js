TextLab.XMLEditor = Backbone.View.extend({
    
	template: JST['textlab/templates/xml-editor'],
  facsTemplate: _.template("<span class='facs-ref' id='<%= id %>'><%= name %></span>"),
  openTagTemplate: _.template("<<%= tag %>>"),
  closeTagTemplate: _.template("</<%= tag %>>"),
  emptyTagTemplate: _.template("<<%= tag %>/>"),
  
  id: 'xml-editor',
  
  events: {
    'click .tag-menu-item': 'onClickTagMenuItem',
    'click .facs-ref': 'onClickImageLink'
  },
            	
	initialize: function(options) {
  },
  
  onClickTagMenuItem: function(event) {
    var tagID = $(event.currentTarget).attr("data-tag-id");		
    var tag = TextLab.Tags[tagID];

    var doc =  this.editor.getDoc();
    var openTag = this.openTagTemplate(tag);
    var closeTag = this.closeTagTemplate(tag);
    
    if( doc.somethingSelected() ) {
      var body = doc.getSelection();
      var insertion = openTag + body + closeTag;
      doc.replaceSelection(insertion);
    } else {
      var caretPosition = doc.getCursor();
      var insertion = openTag + closeTag;
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