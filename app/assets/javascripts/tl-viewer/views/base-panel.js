TextLab.BasePanel = Backbone.View.extend({

  id: 'base-panel',

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
    var metaSpans = this.$('.metamark');
    _.each( metaSpans, function(metaSpan) {
          $(metaSpan).detach();
    })

    // delete the dels that aren't restored
    var delSpans = this.$('.del');
    var restoredDels = this.$('.restore > .del');
    _.each( delSpans, function(delSpan) {
        if( !_.contains(restoredDels, delSpan) ) {
          $(delSpan).detach();
        }
    });
  }

});
