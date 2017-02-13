TextLab.SequencePanel = Backbone.View.extend({

	template: JST['tl-viewer/templates/sequence-panel'],
    
  id: 'sequence-panel',
  
  events: {
    'click .show-all-button': "onShowAll",
    'click .next-step-button': "onNextStep",
    'click .prev-step-button': "onPrevStep"
  },
            	
	initialize: function(options) {
    this.showAll = false;
  },

  onShowAll: function() {    
    this.showAll = true;
    this.render();
    return false;
  },

  onNextStep: function() {    
    // TODO
    return false;
  },

  onPrevStep: function() {    
    // TODO
    return false;
  },
    
  render: function() {    
    var narrativeSteps = this.model.narrativeSteps;
    var steps = ( this.showAll ) ? narrativeSteps.toJSON() : [_.first(narrativeSteps.toJSON())];
    this.$el.html(this.template({ 
      name: this.model.get('name'), 
      steps: steps, 
      showAll: this.showAll 
    }));
  }
  
});  