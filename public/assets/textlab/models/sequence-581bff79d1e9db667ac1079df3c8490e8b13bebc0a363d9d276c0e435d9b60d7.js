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

  moveStep: function( movedStep, newStepNumber) {
    var old_number = movedStep.get('step_number');
    var step = this.narrativeSteps.findWhere({ step_number: newStepNumber });
    step.set('step_number', old_number );
    movedStep.set('step_number', newStepNumber );
    this.narrativeSteps = _.sortBy(this.narrativeSteps.models, function(step) { 
      return step.get('step_number');
    });
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
