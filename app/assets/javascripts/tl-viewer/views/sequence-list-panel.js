TextLab.SequenceListPanel = Backbone.View.extend({

	template: JST['tl-viewer/templates/sequence-list-panel'],
    
  id: 'sequence-list-panel',
  
  events: {
    'click .sequence-link': "onViewSequence"
  },
            	
	initialize: function(options) {
    this.sequences = options.sequences;
  },
  
  onViewSequence: function(event) {    

    // TODO load the sequence from the server and display it .. hide the list and display the panel for this sequence
    var viewLink = $(event.currentTarget);
    var sequenceID = parseInt(viewLink.attr("data-sequence-id"));    

    var sequence = new TextLab.Sequence({ id: sequenceID });
    sequence.fetch({ success: function(sequence) {
      var sequencePanel = new TextLab.SequencePanel({ model: sequence });
      sequencePanel.render();
    }});    

    return false;
  },
  
  render: function() {                      
    this.$el.html(this.template({ sequences: this.sequences }));
  }
  
});