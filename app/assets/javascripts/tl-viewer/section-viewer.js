TextLab.SectionViewer = Backbone.View.extend({
      
  id: 'section-viewer',
  
  render: function() {    
    this.deleteDels();
    this.fixCarets();
  },
  
  fixCarets: function() {
    // since we don't use caret class for formatting, remove it. conflicts with Twitter Bootstrap
    var spans = this.$('span');
    _.each( spans, function( span ) {
      $(span).removeClass('caret');
    });    
  },
  
  deleteDels: function() {
    // delete the dels
    var delSpans = this.$('.del, .metamark');
    _.each( delSpans, function(delSpan) {
      $(delSpan).detach();  
    })    
  }
  
});




