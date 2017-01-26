TextLab.SequenceEditor = Backbone.View.extend({
    
	template: JST['textlab/templates/sequence-editor'],
  
  id: 'sequence-editor',
  
  events: {
    'click .add-step-button': 'onClickAddStep',
    'click .publish-button': 'onClickPublish',
    'click .unpublish-button': 'onClickUnPublish',
    'click .share-button': 'onClickShare',
    'click .stop-sharing-button': 'onClickStopSharing',
    'click .submit-button': 'onClickSubmit',
    'click .return-button': 'onClickReturn',
    'click .rename-button': 'onClickRename',
    'click .delete-button': 'onClickDelete'
  },  
            	
	initialize: function(options) {
     this.leaf = options.leaf;
     this.tabbedEditor = options.tabbedEditor;
  },

  onClickPublish: function() {
    // this.tabbedEditor.starTranscription( this.model.id );  
  },
  
  onClickUnPublish: function() {
    // this.tabbedEditor.unStarTranscription( this.model.id );
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
    
    this.save( _.bind( function() {
      var shareButton = this.$('.share-button');
      var stopShareButton = this.$('.stop-sharing-button');
      
      if( shared ) {
        shareButton.addClass('hidden');
        stopShareButton.removeClass('hidden');
      } else {
        stopShareButton.addClass('hidden');
        shareButton.removeClass('hidden');
      }      
    }, this));    
  },

  onClickSubmit: function() {    
    // this.$('#action-dropdown').dropdown('toggle');

    // var submitConfirmed = confirm("Do you wish to submit this transcription for publication?");
    
    // if( submitConfirmed ) {
    //   this.tabbedEditor.submitTranscription( this.model );
    // }
    
    // return false;
  },
  
  onClickReturn: function() {
    // this.$('#action-dropdown').dropdown('toggle');

    // var returnConfirmed = confirm("Do you wish to return this transcription to its owner?");
    
    // if( returnConfirmed ) {
    //   this.tabbedEditor.returnTranscription( this.model );
    // }
    
    // return false;
  },
  
  onClickRename: function() {
    // var onUpdateCallback = _.bind(function() {
    //   this.save( _.bind( function() {
    //     this.tabbedEditor.renameTranscription( this.model.id, this.model.get('name'));        
    //   }, this));
    // }, this);  
    
    // var transcriptionDialog = new TextLab.TranscriptionDialog( { model: this.model, callback: onUpdateCallback, mode: 'edit' } );
    // transcriptionDialog.render();    
    // return false;   
  },

  onClickDelete: function() {
    // this.$('#action-dropdown').dropdown('toggle');
    
    // var deleteConfirmed = confirm("Do you wish to delete the transcription titled '"+this.model.get('name')+"'? ");
    
    // if( deleteConfirmed ) {
    //   this.tabbedEditor.deleteTranscription( this.model );
    // }
    
    // return false;
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

  render: function() {
    
    var showSubmitButton = !this.tabbedEditor.projectOwner;
    var showReturnButton = (this.tabbedEditor.projectOwner && this.model.get('submitted'));
    var showActionMenu = (this.model.get('owner') && !this.model.get('submitted'));
    // var showTags = !this.model.isReadOnly();    
    
    var statusMessage = "";
    if( this.model.get('submitted') ) {
      if( this.tabbedEditor.projectOwner ) {
        statusMessage = "Sequence submitted by: username."
      } else {
        statusMessage = "Sequence submitted for publication."
      }
    } else if( this.model.get('shared') && this.model.isReadOnly() ) {
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
  }
  
  
});