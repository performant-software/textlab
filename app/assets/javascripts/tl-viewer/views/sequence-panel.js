TextLab.SequencePanel = Backbone.View.extend({

  stepSequencePanelTemplate: JST['tl-viewer/templates/step-sequence-panel'],
  sequenceGridPanelTemplate: JST['tl-viewer/templates/sequence-grid-panel'],
  emptySequencePanelTemplate: JST['tl-viewer/templates/empty-sequence-panel'],

  facsSelectorTemplate: _.template( "span[facs='#<%= leafID %>-<%= zoneLabel %>']" ),

  id: 'sequence-panel',

  events: {
    'click .toggle-grid-button': "onToggleGrid",
    'click .next-step-button': "onNextStep",
    'click .goto-step-button': "onGotoStep",
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
      this.setCurrentStep(null);
    }

    this.render();
    return false;
  },

  onNextStep: function() {
    var maxSteps = this.model.narrativeSteps.models.length;

    if( this.stepNumber < maxSteps-1 ) {
      var nextStep = this.stepNumber + 1;
      this.setCurrentStep(nextStep);
      this.render();
    }
    return false;
  },

  onGotoStep: function(event) {
    var gotoButton = $(event.currentTarget);
    var stepNumber = parseInt(gotoButton.attr("data-step-number"));
    this.setCurrentStep(stepNumber);
    this.render();
    return false;
  },

  onPrevStep: function() {
    if( this.stepNumber > 0 ) {
      var nextStep = this.stepNumber - 1;
      this.setCurrentStep(nextStep);
      this.render();
    }
    return false;
  },

  onBackToList: function() {
    this.setCurrentStep(null);
    this.$el.detach();
    this.sequenceListPanel.$('#sequence-list').show();
    this.leafViewer.mouseOverEnabled = true;
  },

  gotoFirstStep: function() {
    this.setCurrentStep(0);
  },



  setCurrentStep: function(nextStepNumber) {
    if( this.currentStep ) {
      var currentZoneLabel = this.currentStep.get('zone_label');

      if( currentZoneLabel && currentZoneLabel != "" ) {
        this.leafViewer.highlightZone( currentZoneLabel, false );
        this.hightlightSpan( currentZoneLabel, false );
      }
    }

    if( nextStepNumber != null && this.model.narrativeSteps &&
        this.model.narrativeSteps.models.length > 0 ) {
      var nextStep = this.model.narrativeSteps.models[nextStepNumber];
      var nextZoneLabel = nextStep.get('zone_label');

      if( nextZoneLabel && nextZoneLabel != "" ) {
        this.leafViewer.highlightZone( nextZoneLabel, true );
        this.hightlightSpan( nextZoneLabel, true );
      }
    } else {
      nextStep = null;
    }

    this.currentStep = nextStep;
    this.stepNumber = nextStepNumber;
  },

  hightlightSpan: function( zoneLabel, state ) {
    var leafID = this.leafViewer.model.xml_id;
    var facsSelector = this.facsSelectorTemplate({
      leafID: leafID,
      zoneLabel: zoneLabel
    });
    var facsSpan = this.leafViewer.$(facsSelector);

    if( state ) {
      facsSpan.addClass('seq-highlight');
    } else {
      facsSpan.removeClass('seq-highlight');
    }
  },

  render: function() {
    if( this.showGrid ) {
      var currentStepNumber = (this.currentStep != null) ? this.currentStep.get('step_number') : -1;
      this.$el.html(this.sequenceGridPanelTemplate({
        name: this.model.get('name'),
        owner: this.model.get('owner_name'),
        currentStep: currentStepNumber,
        steps: this.model.narrativeSteps.toJSON()
      }));
    } else {
      if( this.currentStep != null ) {
        this.$el.html(this.stepSequencePanelTemplate({
          name: this.model.get('name'),
          owner: this.model.get('owner_name'),
          stepNumber: this.stepNumber,
          maxSteps: this.model.narrativeSteps.models.length,
          step: this.currentStep.toJSON()
        }));
      } else {
        this.$el.html(this.emptySequencePanelTemplate({
          name: this.model.get('name')
        }));
      }
    }
  }

});
