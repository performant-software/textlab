TextLab.XMLEditor = Backbone.View.extend({
    
	template: JST['textlab/templates/xml-editor'],
  facsTemplate: _.template("<span class='facs-ref' id='<%= id %>'><%= name %></span>"),
  
  id: 'xml-editor',
  
  events: {
    'click .tag-menu-item': 'onClickTagMenuItem',
    'click .facs-ref': 'onClickFacsRef'
  },
            	
	initialize: function(options) {
    
    this.tags = [ 
      { label: 'add' },   
      { label: 'addSpan' },   
      { label: 'anchor' },   
      { label: 'choice' },   
      { label: 'corr' },   
      { label: 'delSpan' },   
      { label: 'ex' },   
      { label: 'expan' },   
      { label: 'handShift' },   
      { label: 'hi' },   
      { label: 'l' },   
      { label: 'lb' },   
      { label: 'metamark' },   
      { label: 'rdg' },   
      { label: 'restore' },   
      { label: 'sic' },   
      { label: 'restore' },   
      { label: 'subst' },   
      { label: 'restore' },   
      { label: 'supplied' },   
      { label: 'unclear' },   
    ];
    
  },
  
  onClickTagMenuItem: function(e) {
    if( this.editor ) {
      
      // insert tag at caret
      var doc =  this.editor.getDoc();
      var caretPosition = doc.getCursor();
      var facsID = "image5";
      doc.replaceRange("image5", caretPosition );
      var endIndex = doc.indexFromPos(caretPosition) + facsID.length;
      var endPos = doc.posFromIndex(endIndex);
      doc.markText( caretPosition, endPos, { className: "facs-ref", atomic: true } );
          
    }
  },
  
  onClickFacsRef: function() {
    // TODO

  },
      
  render: function() {      
    this.$el.html(this.template({ tags: this.tags })); 
  },
  
  initEditor: function() {
    var editorEl = this.$("#codemirror").get(0);
		this.editor = CodeMirror.fromTextArea( editorEl, {
        mode: "xml",
        lineNumbers: true
		});    
  }  
  
});