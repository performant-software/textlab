TextLab.Sequence = Backbone.Model.extend({
  urlRoot: "sequences",
  
  initialize: function( attributes, options ) {
    
  },
  
  isReadOnly: function() {
    var owner = this.get('owner');
    var shared = this.get('shared');
    var submitted = this.get('submitted');    
    var readOnly = false;
    
    if( shared && !owner ) {
      readOnly = true;
    }
    
    if( submitted && owner ) {
      readOnly = true;
    }  
    
    return readOnly;     
  }
    
});

TextLab.Sequence.newSequence = function( leaf ) {  
  var sequence = new TextLab.Sequence({ 
    leaf_id: leaf.id, 
    name: 'untitled',
    document_id: leaf.get('document_id'), 
    shared: false, 
    submitted: false,
    published: false,
    owner: true
  });
  return sequence;
};


TextLab.SequenceCollection = Backbone.Collection.extend({
  model: TextLab.Sequence,
  url: "sequences"
}); 