TextLab.DocumentListView = Backbone.View.extend({

	template: JST['textlab/templates/document-list-view'],
    
  id: 'document-list-view',
  
  events: {
    'click .new-document-button': "onNewDocument",
    'click .yes-button': "onAcceptInvite",
    'click .no-button': "onDeclineInvite",
    'click .delete-document-button': "onDeleteDocument"    
  },
            	
	initialize: function(options) {
  },
  
  onNewDocument: function() {    
    var onCreateCallback = _.bind(function(doc) {
      this.collection.add(doc);
      doc.save(null, { success: _.bind( function() {
        this.render();
      },this)});
    }, this);
          
    var doc = new TextLab.Document();

    // load project configs before we display dialog
    doc.getProjectConfigs( _.bind(function( projectConfigs ) {
      var documentModalDialog = new TextLab.NewDocumentDialog( { 
        model: doc, 
        projectConfigs: projectConfigs,
        callback: onCreateCallback 
      });
      documentModalDialog.render();     
    }, this));

  },
  
  onAcceptInvite: function(event) {
    var yesButton = $(event.currentTarget);
    var documentID = parseInt(yesButton.attr("data-doc-id"));    
    var doc = this.collection.findWhere({ id: documentID });
    var membershipID = doc.get("membership_id");
    
    // update the invite accepted = yes
    var membership = new TextLab.Membership( { id: membershipID, accepted: true } );
    membership.save( null, {
      success: _.bind( function() {
        doc.set('accepted', true);
        this.render();
      }, this ),
      error: TextLab.Routes.routes.onError
    });    
  },
  
  onDeclineInvite: function(event) {
    var noButton = $(event.currentTarget);
    var documentID = parseInt(noButton.attr("data-doc-id"));
    var doc = this.collection.findWhere({ id: documentID });
    var membershipID = doc.get("membership_id");
        
    // remove the membership entry
    var membership = new TextLab.Membership( { id: membershipID } );
    membership.destroy( {
      success: _.bind( function() {
        this.collection.remove( doc );
        this.render();
      }, this ),
      error: TextLab.Routes.routes.onError
    });    
  },  
  
  onDeleteDocument: function(event) {
    var deleteButton = $(event.currentTarget);
    var documentID = parseInt(deleteButton.attr("data-doc-id"));
    var deletedDoc = this.collection.get(documentID);
    
    deleteButton.confirmation('show');    
    
    // delete if confirmed
    this.$el.on('confirmed.bs.confirmation', _.bind( function () {
      deletedDoc.destroy({ success: _.bind( function() {
        this.render();
      }, this)});
    }, this));
        
  },
  
  render: function() {                      
    this.$el.html(this.template({ documents: this.collection.toJSON() }));
  }
  
});
