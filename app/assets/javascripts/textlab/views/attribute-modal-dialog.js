TextLab.AttributeModalDialog = Backbone.View.extend({
    
	template: JST['textlab/templates/attribute-modal-dialog'],
  attributeTemplate: _.template('<%= key %>="<%= value %>" '),
  
  id: 'attribute-modal-container',
  
	partials: {
		stringInput: JST['textlab/templates/common/string-input'],
		dropdownInput: JST['textlab/templates/common/dropdown-input'],
    numberInput: JST['textlab/templates/common/number-input']
	},
  
  events: {
    'click .create-button': 'onCreate',
    'click .cancel-button': 'onCancel'
  },
            	
	initialize: function(options) {
    this.tag = options.tag;
    this.currentZone = options.zone;
    this.callback = options.callback;
  },
  
  onCreate: function() {    
    var attributesModal = $('#attributes-modal');
    
    var attributes = " ";
    var zoneOffset = null;
    
    _.each( this.tag.attributes, _.bind( function( attribute, key ) {
      var fieldID = 'att-'+key;
      var value = $('#'+fieldID).val();      
      var pair = { key: key, value: value };

      var attrString = this.attributeTemplate(pair);    
      
      // use regex to find start offset within attrString and add length of attributes so far
      if( attribute.fieldType == 'zone' && value != null ) {
        var match = /="/.exec(attrString);
        zoneOffset = match.index + attributes.length + 2;
      } 
      
      attributes = attributes + attrString;      
    }, this));
    
    this.close( _.bind( function() {
      this.callback({ attrString: attributes, zoneOffset: zoneOffset });
    }, this));
  },
  
  onCancel: function() {    
    this.close();
  },
  
  close: function( closeCallback ) {
    var attributesModal = $('#attributes-modal');
    
    attributesModal.on('hidden.bs.modal', _.bind( function () {
      this.$el.detach();
      if( closeCallback ) {
        closeCallback();
      }
    }, this));
    
    attributesModal.modal('hide');
  },
  
  render: function() {
    
    // prepare list of options for zone drop down
    var zoneOptions = _.map( this.model.zones.models, function( zone ) {
      var zoneLabel = zone.get('zone_label');
      return { value: zoneLabel, text: zoneLabel };
    });
    
    var sortedOptions = _.sortBy(zoneOptions, function(opt) {
      return opt.text;
    }, this ); 
    
    var currentZoneLabel = this.currentZone ? this.currentZone.get('zone_label') : '';
    
    this.$el.html(this.template({ tag: this.tag, defaultZone: currentZoneLabel, zones: sortedOptions, partials: this.partials }));    
    $('#modal-container').html(this.$el);
    $('#attributes-modal').modal('show');
  } 
    
});