TextLab.SequenceEditor = Backbone.View.extend({
    
	template: JST['textlab/templates/sequence-editor'],
  gridTemplate: JST['textlab/templates/sequence-grid'],

  id: 'sequence-editor',
  
  events: {
    'click .add-step-button': 'onClickAddStep',
    'click .edit-step-button': 'onClickEditStep',
    'click .delete-step-button': 'onClickDeleteStep',
    'click .zone-link': 'onClickZoneLink',
    'click .publish-button': 'onClickPublish',
    'click .unpublish-button': 'onClickUnPublish',
    'click .share-button': 'onClickShare',
    'click .stop-sharing-button': 'onClickStopSharing',
    'click .submit-button': 'onClickSubmit',
    'click .return-button': 'onClickReturn',
    'click .rename-button': 'onClickRename',
    'click .delete-button': 'onClickDelete',
    'click .up-step-button': 'onClickStepUp',
    'click .down-step-button': 'onClickStepDown'    
  },  
            	
	initialize: function(options) {
     this.leaf = options.leaf;
     this.tabbedEditor = options.tabbedEditor;
     this.surfaceView = options.surfaceView;
  },

  onClickPublish: function() {
    this.tabbedEditor.starTab( 'sequence', this.model.id );
  },
  
  onClickUnPublish: function() {
    this.tabbedEditor.unStarTab( 'sequence', this.model.id );
  },
  
  onClickShare: function() {
    this.updateSharing( true );
    return false;
  },
  
  onClickStopSharing: function() {
    this.updateSharing( false );
    return false;
  },
  
  updateSharing: function( shared ) {
    this.$('#action-dropdown').dropdown('toggle');
    this.model.set('shared', shared );
    
    this.model.save( null, { success: _.bind( function() {
      var shareButton = this.$('.share-button');
      var stopShareButton = this.$('.stop-sharing-button');
      
      if( shared ) {
        shareButton.addClass('hidden');
        stopShareButton.removeClass('hidden');
      } else {
        stopShareButton.addClass('hidden');
        shareButton.removeClass('hidden');
      }      
    }, this) });    
  },

  onClickSubmit: function() {    
    this.$('#action-dropdown').dropdown('toggle');

    var submitConfirmed = confirm("Do you wish to submit this sequence for publication?");
    
    if( submitConfirmed ) {
      this.tabbedEditor.submitTab( 'sequence', this.model );
    }
    
    return false;
  },
  
  onClickReturn: function() {
    this.$('#action-dropdown').dropdown('toggle');

    var returnConfirmed = confirm("Do you wish to return this sequence to its owner?");
    
    if( returnConfirmed ) {
      this.tabbedEditor.returnTab( 'sequence', this.model );
    }
    
    return false;
  },
  
  onClickRename: function() {
    var onRenameCallback = _.bind(function(sequence) {
      sequence.save(null, { success: _.bind( function() {
        this.tabbedEditor.renameTab( 'sequence', this.model.id, this.model.get('name'));    
      }, this) });
    }, this);  
    
    var tabDialog = new TextLab.TabDialog( { model: this.model, callback: onRenameCallback, mode: 'edit' } );
    tabDialog.render();  
    return false;  
  },

  onClickDelete: function() {
    this.$('#action-dropdown').dropdown('toggle');
    
    var deleteConfirmed = confirm("Do you wish to delete the transcription titled '"+this.model.get('name')+"'? ");
    
    if( deleteConfirmed ) {
      this.tabbedEditor.deleteTab( 'sequence', this.model );
    }
    
    return false;
  },

  moveStep: function( stepID, positionOffset ) {

    // prevent further movement until saved
    this.$('.arrow-button').addClass('disabled');

    var steps = this.model.narrativeSteps;
    var currentStep = steps.findWhere({ id: stepID });
    var currentStepNumber = currentStep.get('step_number');
    var targetStepNumber = currentStepNumber + positionOffset;
    var targetStep = steps.findWhere({ step_number: targetStepNumber });

    currentStep.set('new_step_number', targetStepNumber );

    currentStep.save(null, { success: _.bind( function() {
      targetStep.set('step_number', currentStepNumber );
      steps.sort();
      this.renderGrid();
    }, this) });
  },

  onClickStepUp: function(event) {
    var upButton = this.$(event.currentTarget);
    var stepID = parseInt(upButton.attr("data-step-id"));  
    this.moveStep( stepID, -1 );  
    return false;
  },

  onClickStepDown: function(event) {
    var downButton = this.$(event.currentTarget);
    var stepID = parseInt(downButton.attr("data-step-id"));  
    this.moveStep( stepID, 1 );  
    return false;
  },

  onClickAddStep: function() {
     // TODO load the step transcription from the previous step
     this.activateNarrativeStepDialog(null, null);
  },

  activateNarrativeStepDialog: function( stepText, zoneID ) {
    var onCreateCallback = _.bind(function(step) {
      this.model.narrativeSteps.add(step);
      step.save(null, { success: _.bind( function() {
        this.renderGrid();
      }, this) });
    }, this);  
    
    var zones = this.generateZoneList();
    var nextStepNumber = this.model.narrativeSteps.models.length;

    // if null, populate with the previous step's text
    if( stepText == null ) {
      if( nextStepNumber > 0 ) {
        var prevStep = this.model.narrativeSteps.findWhere({ step_number: nextStepNumber-1 });
        stepText = prevStep.get('step');
      } else {
        stepText = "";
      }
    }

    var narrativeStep = new TextLab.NarrativeStep({
      step_number: nextStepNumber,
      step: stepText,
      zone_id: zoneID, 
      sequence_id: this.model.id 
    });
    var stepDialog = new TextLab.NarrativeStepDialog({ 
      zones: zones,
      model: narrativeStep, 
      callback: onCreateCallback 
    });
    stepDialog.render();   
  },

  onClickEditStep: function(event) {
    var editButton = $(event.currentTarget);
    var stepID = parseInt(editButton.attr("data-step-id"));
    var narrativeStep = this.model.narrativeSteps.get(stepID);

    var onUpdateCallback = _.bind(function(step) {
      step.save(null, { success: _.bind( function() {
        this.renderGrid();
      }, this) });
    }, this);

    var zones = this.generateZoneList();

    var stepDialog = new TextLab.NarrativeStepDialog({ 
      zones: zones,
      model: narrativeStep, 
      callback: onUpdateCallback, 
      mode: 'edit' 
    });
    stepDialog.render();
    return false;
  },

  onClickZoneLink: function(event) {
    var zoneLink = $(event.currentTarget);
    var zoneID = parseInt(zoneLink.attr("data-zone-id"));
    var zone = this.leaf.zones.get(zoneID);
    this.surfaceView.selectZone( zone );
    return false;
  },

  // prepare list of options for zone drop down
  generateZoneList: function() {
    var zoneOptions = _.map( this.leaf.zones.models, function( zone ) {
      return { value: zone.id, text: zone.get('zone_label') };
    });
    
    var sortedOptions = _.sortBy(zoneOptions, function(opt) {
      return opt.text;
    }, this ); 

    return sortedOptions;
  },

  onClickDeleteStep: function(event) {
    var deleteButton = $(event.currentTarget);
    var stepID = parseInt(deleteButton.attr("data-step-id"));
    var narrativeStep = this.model.narrativeSteps.get(stepID);

    deleteButton.confirmation('show');    
    
    // delete if confirmed
    deleteButton.on('confirmed.bs.confirmation', _.bind( function () {
      narrativeStep.destroy({ success: _.bind( function() {
        this.model.renumberSteps();
        this.renderGrid();
      }, this)});
    }, this));  

    return false;
  },

  togglePublishButton: function( buttonState ) {
    if( buttonState ) {
      this.$('.unpublish-button').addClass('hidden');
      this.$('.publish-button').removeClass('hidden');
    } else {
      this.$('.publish-button').addClass('hidden');
      this.$('.unpublish-button').removeClass('hidden');
    }
  },

  renderGrid: function() {

    var steps = this.model.narrativeSteps.toJSON();

    // look up the zone labels for each zone
    var narrativeSteps = _.map( steps, function(step) {
      var zoneID = parseInt(step.zone_id);
      var zone = this.leaf.zones.get(zoneID);
      if( zone ) {
        step.zoneLabel = zone.get('zone_label');
      }
      return step;
    }, this);

    this.$('#sequence-grid').html(this.gridTemplate({
      readOnly: this.model.isReadOnly(this.tabbedEditor.projectOwner), 
      narrativeSteps: narrativeSteps
    })); 
  },

  save: function( callback ) {
    var onError = function() {
      $('.error-message').html('ERROR: Unable to save changes.');
      TextLab.Routes.routes.onError();
    };
  
    var onSuccess = function() {
      $('.error-message').html('');
      if( callback ) {
        callback();
      }
    };
    
    this.model.save(null, { success: onSuccess, error: onError });
  },  

  render: function() {

    var showPublishButton = this.tabbedEditor.projectOwner;
    var readOnly = this.model.isReadOnly(this.tabbedEditor.projectOwner);
    var showSubmitButton = !this.tabbedEditor.projectOwner;
    var showReturnButton = (this.tabbedEditor.projectOwner && this.model.get('submitted'));
    var showActionMenu = (this.model.get('owner') && !this.model.get('submitted'));
    var showAddStep = !readOnly;  
    
    var statusMessage = "";
    if( this.model.get('submitted') ) {
      if( this.tabbedEditor.projectOwner ) {
        statusMessage = "Sequence submitted by: "+this.model.get('owner_name');
      } else {
        statusMessage = "Sequence submitted for publication."
      }
    } else if( this.model.get('shared') && readOnly ) {
      statusMessage = "Sequence shared by: username";
    }

    var actionWidthClass = '';
    if( showActionMenu ) {
      if( showPublishButton ) {
        actionWidthClass = 'room-for-action-and-publish';
      } else {
        actionWidthClass = 'room-for-action-menu';
      }
    }
    if( showReturnButton ) {
      actionWidthClass = 'room-for-return-button';
    }
              
    this.$el.html(this.template({ 
      showAddStep: showAddStep,
      showPublishButton: showPublishButton,
      showSubmitButton: showSubmitButton,
      showReturnButton: showReturnButton,
      showActionMenu: showActionMenu, 
      published: this.model.get('published'),
      submitted: this.model.get('submitted'),
      shared: this.model.get('shared'),
      statusMessage: statusMessage,
      actionWidthClass: actionWidthClass
    })); 

    this.renderGrid();
  }
  
  
});