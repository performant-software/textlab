TextLab.Sequence = Backbone.Model.extend({
  
  initialize: function( attributes, options ) {
    this.afterLoad( attributes );
  },

  url: function() {
    return "/sequences/"+this.id+".json?p=true";
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
  }
    
});


TextLab.SequenceCollection = Backbone.Collection.extend({
  model: TextLab.Sequence,
  url: "/sequences"
}); 
