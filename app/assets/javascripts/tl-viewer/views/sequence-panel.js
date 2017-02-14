TextLab.SequencePanel = Backbone.View.extend({

	stepSequencePanelTemplate: JST['tl-viewer/templates/step-sequence-panel'],
  sequenceGridPanelTemplate: JST['tl-viewer/templates/sequence-grid-panel'],
    
  id: 'sequence-panel',
  
  events: {
    'click .toggle-grid-button': "onToggleGrid",
    'click .next-step-button': "onNextStep",
    'click .prev-step-button': "onPrevStep",
    'click .back-to-list-link': "onBackToList"
  },
            	
	initialize: function(options) {
    this.sequenceListPanel = options.sequenceListPanel;
    this.showGrid = false;
    this.gotoFirstStep();
  },

  onToggleGrid: function() {    
    this.showGrid = !this.showGrid;

    if(!this.showGrid) {
      this.gotoFirstStep();
    }

    this.render();
    return false;
  },

  onNextStep: function() {   
    var maxSteps = this.model.narrativeSteps.models.length;

    if( this.stepNumber < maxSteps-1 ) {
      this.stepNumber = this.stepNumber + 1;
      this.currentStep = this.model.narrativeSteps.models[this.stepNumber];
      this.render();      
    }
    return false;
  },

  onPrevStep: function() {    

    if( this.stepNumber > 0 ) {
      this.stepNumber = this.stepNumber - 1;
      this.currentStep = this.model.narrativeSteps.models[this.stepNumber];
      this.render();
    }
    return false;
  },

  onBackToList: function() {
    this.$el.detach();
    this.sequenceListPanel.$('#sequence-list').show();
  },

  gotoFirstStep: function() {
    var narrativeSteps = this.model.narrativeSteps;
    this.currentStep = _.first(narrativeSteps.models);
    this.stepNumber = 0;
  },
    
  render: function() {    

    if( this.showGrid ) {
      this.$el.html(this.sequenceGridPanelTemplate({ 
        name: this.model.get('name'), 
        steps: this.model.narrativeSteps.toJSON()
      }));
    } else {
      this.$el.html(this.stepSequencePanelTemplate({ 
        name: this.model.get('name'), 
        stepNumber: this.stepNumber,
        maxSteps: this.model.narrativeSteps.models.length,
        step: this.currentStep.toJSON()
      }));      
    }
  }
  
});  