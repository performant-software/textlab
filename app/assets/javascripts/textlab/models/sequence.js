TextLab.Sequence = Backbone.Model.extend({
  urlRoot: "sequences",
  
  initialize: function( attributes, options ) {
    this.afterLoad( attributes );
  },

  afterLoad: function( attributes ) {
    if( attributes && attributes["narrative_steps"] ) {
      this.narrativeSteps = new TextLab.NarrativeStepCollection(attributes["narrative_steps"]);
    } else {
      this.narrativeSteps = new TextLab.NarrativeStepCollection();
    }
  },
  
  sync: function(method, model, options) {
    
    // add hook for afterLoad event that does something after the model has been loaded
    if( this.afterLoad && (method == 'read' || method == 'create') ) {    
      if( options.success ) {
        var originalCallback = options.success;
        options.success = _.bind( function( attributes ) { 
          this.afterLoad( attributes );
          originalCallback( attributes );
        }, this);
      } else {
        options.success = _.bind( this.afterLoad, this );
      }      
    }
    
    if( this.beforeSave && method == 'update' ) {    
      this.beforeSave();
    }
    
    Backbone.sync(method, model, options);
  },

  insertStep: function( movedStep, newStepNumber) {
    // renumber the other steps and assign this step this number.
    var steps = this.narrativeSteps.models;
    var i = newStepNumber + 1;

    _.each( steps, function(step) {
      // make a space at this point in the sequence, don't order self
      if( step.id != movedStep.id ) {
        if( step.get('step_number') >= newStepNumber ) {
          step.set('step_number', i++ );
        }
      }
    });

    movedStep.set('step_number', newStepNumber);
  },

  renumberSteps: function() {
    var steps = this.narrativeSteps.models;

    var i = 0;
    _.each( steps, function(step) { 
      step.set('step_number', i++) 
    });
  },

  isReadOnly: function( isProjectOwner ) {
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

    if( submitted && isProjectOwner ) {
      readOnly = false;
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