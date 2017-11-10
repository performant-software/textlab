TextLab.OpenTabDialog = Backbone.View.extend({
    
	template: JST['textlab/templates/open-tab-dialog'],
  listEntryTemplate: _.template("<%= name %> (transcription)"),

  id: 'open-tab-dialog-container',
  
	partials: {
    dropdownInput: JST['textlab/templates/common/dropdown-input']
	},
  
  events: {
    'click .ok-button': 'onOK',
    'click .cancel-button': 'onCancel'
  },
            	
	initialize: function(options) {
    this.callback = options.callback;
    this.transcriptions = options.transcriptions;
    this.sequences = options.sequences;
  },
  
  onOK: function() {    
    var selection = $('#tab').val();    

    var tabType = (selection[0] == 's') ? 'sequence' : 'transcription';
    var tabID = selection.substr(1);

    this.close( _.bind( function() {
      if( tabType == 'transcription') {
        var transcription = _.find( this.transcriptions, function( t ) { return (t.id == tabID); });
        this.callback(transcription,tabType);
      } else {
        var sequence = _.find( this.sequences, function( s ) { return (s.id == tabID); });
        this.callback(sequence,tabType);
      }
    }, this));
  },
  
  onCancel: function() {    
    this.close();
  },
    
  close: function( closeCallback ) {
    var transcriptionModal = $('#open-tab-modal');
    
    transcriptionModal.on('hidden.bs.modal', _.bind( function () {
      this.$el.detach();
      if( closeCallback ) {
        closeCallback();
      }
    }, this));
    
    transcriptionModal.modal('hide');
  },
  
  render: function() {
    
    var transcriptionList = _.map( this.transcriptions, function(tab) { 
      return { 
        value: 't'+tab.id, 
        text: tab.get('name')+' (transcription)',
      }; 
    }, this);

    var sequenceList = _.map( this.sequences, function(tab) { 
      return { 
        value: 's'+tab.id, 
        text: tab.get('name')+' (sequence)',
      }; 
    }, this);
      
    dropDownList = _.sortBy(_.union(transcriptionList,sequenceList), function(opt) { return opt.text; } ); 
    
    this.$el.html(this.template({ tabs: dropDownList, partials: this.partials }));    
    $('#modal-container').html(this.$el);
    $('#open-tab-modal').modal('show');
  } 
    
});
