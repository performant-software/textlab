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
    this.leafViewer = options.leafViewer;
    this.showGrid = false;
    this.gotoFirstStep();
  },

  onToggleGrid: function() {    
    this.showGrid = !this.showGrid;

    if(!this.showGrid) {
      this.leafViewer.mouseOverEnabled = false;
      this.gotoFirstStep();
    } else {
      this.leafViewer.mouseOverEnabled = true;
      this.leafViewer.highlightZone( this.currentStep.get('zone_label'), false );
    }

    this.render();
    return false;
  },

  onNextStep: function() {   
    var maxSteps = this.model.narrativeSteps.models.length;

    if( this.stepNumber < maxSteps-1 ) {
      this.leafViewer.highlightZone( this.currentStep.get('zone_label'), false );

      this.stepNumber = this.stepNumber + 1;
      this.currentStep = this.model.narrativeSteps.models[this.stepNumber];
      this.render();      

      this.leafViewer.highlightZone( this.currentStep.get('zone_label'), true );
    }
    return false;
  },

  onPrevStep: function() {    

    if( this.stepNumber > 0 ) {
      this.leafViewer.highlightZone( this.currentStep.get('zone_label'), false );

      this.stepNumber = this.stepNumber - 1;
      this.currentStep = this.model.narrativeSteps.models[this.stepNumber];
      this.render();

      this.leafViewer.highlightZone( this.currentStep.get('zone_label'), true );
    }
    return false;
  },

  onBackToList: function() {
    this.leafViewer.highlightZone( this.currentStep.get('zone_label'), false );
    this.$el.detach();
    this.sequenceListPanel.$('#sequence-list').show();
    this.leafViewer.mouseOverEnabled = true;
  },

  gotoFirstStep: function() {
    var narrativeSteps = this.model.narrativeSteps;
    this.currentStep = _.first(narrativeSteps.models);
    this.stepNumber = 0;
    var zoneLabel = this.currentStep.get('zone_label');
    this.leafViewer.highlightZone( zoneLabel, true );
    this.hightlightSpan( zoneLabel, true );
  },

  hightlightSpan: function( zoneLabel, state ) {
    // in facs
    var span$ = this.leafViewer.$("#img_17-"+zoneLabel);

    if( state ) {
      span$.addClass('seq-highlight')
    } else {
      span$.removeClass('seq-highlight')
    }
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