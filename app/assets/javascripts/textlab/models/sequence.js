TextLab.Sequence = Backbone.Model.extend({
  urlRoot: "sequences",
  
  initialize: function( attributes, options ) {
    
  },

  newSequence: function( documentID ) {  
    var sequence = new TextLab.Sequence({ 
      leaf_id: this.model.id, 
      name: 'untitled',
      document_id: documentID, 
      shared: false, 
      submitted: false,
      published: false,
      owner: true
    });
    return sequence;
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

TextLab.SequenceCollection = Backbone.Collection.extend({
  model: TextLab.Sequence,
  url: "sequences"
}); 