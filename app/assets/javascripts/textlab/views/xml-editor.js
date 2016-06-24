TextLab.XMLEditor = Backbone.View.extend({
    
	template: JST['textlab/templates/xml-editor'],
  attributesModalTemplate: JST['textlab/templates/attributes-modal'],
  facsTemplate: _.template("<span class='facs-ref' id='<%= id %>'><%= name %></span>"),
  openTagTemplate: _.template("<<%= tag %> <%= attributes %>>"),
  closeTagTemplate: _.template("</<%= tag %>>"),
  emptyTagTemplate: _.template("<<%= tag %> <%= attributes %>/>"),
  
  id: 'xml-editor',
  
	partials: {
		stringInput: JST['textlab/templates/common/string-input'],
		dropdownInput: JST['textlab/templates/common/dropdown-input'],
    numberInput: JST['textlab/templates/common/number-input']
	},
  
  events: {
    'click .tag-menu-item': 'onClickTagMenuItem',
    'click .facs-ref': 'onClickImageLink'
  },
            	
	initialize: function(options) {
  },
  
  onClickTagMenuItem: function(event) {
    
    var tagID = $(event.currentTarget).attr("data-tag-id");		
    var tag = TextLab.Tags[tagID];
        
    if( tag.attributes ) {    
      var onCreate = function() {
        // TODO retrieve the attributes from the dialog
        var attributes = [];
        this.generateTag(tag,attributes);
      };
      
      var onCancel = function() {
        this.generateTag(tag);
      };
      
      this.showAttributeDialog( tag, onCreate, onCancel );
    } else {
      this.generateTag(tag);
    }
     
  },
  
  showAttributeDialog: function( tag, onCreate, onCancel ) {
    $('#modal-container').html(this.attributesModalTemplate({ tag: tag, partials: this.partials }));

    // TODO add event handles for save and cancel 
    $('#attributes-modal.save-button').click( function() {
      alert('click');
    });
        
    $('#attributes-modal').modal('show');
  },
  
  generateTag: function(tag, attributes) {
    var insertion;
    var attributeString = this.generateAttributes( tag, attributes );
    var doc =  this.editor.getDoc();
    
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
  
  generateAttributes: function( attributes ) {    
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