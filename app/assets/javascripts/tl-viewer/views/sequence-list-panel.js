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

    var viewLink = $(event.currentTarget);
    var sequenceID = parseInt(viewLink.attr("data-sequence-id"));  

    var onLoad = _.bind( function(sequence) {
      var sequencePanel = new TextLab.SequencePanel({ 
        sequenceListPanel: this,
        model: sequence });
      this.$('#sequence-list').hide();
      sequencePanel.render();
      this.$el.append(sequencePanel.$el);
    }, this );

    var sequence = new TextLab.Sequence({ id: sequenceID });
    sequence.fetch({ success: onLoad });    

    return false;
  },
  
  render: function() {                      
    this.$el.html(this.template({ sequences: this.sequences }));
  }
  
});