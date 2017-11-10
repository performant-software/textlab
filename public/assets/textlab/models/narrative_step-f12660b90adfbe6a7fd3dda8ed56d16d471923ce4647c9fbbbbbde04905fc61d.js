TextLab.NarrativeStep = Backbone.Model.extend({
  urlRoot: "narrative_steps"    
});

TextLab.NarrativeStepCollection = Backbone.Collection.extend({
  model: TextLab.NarrativeStep,
  url: "narrative_steps",
  comparator: 'step_number'
}); 
