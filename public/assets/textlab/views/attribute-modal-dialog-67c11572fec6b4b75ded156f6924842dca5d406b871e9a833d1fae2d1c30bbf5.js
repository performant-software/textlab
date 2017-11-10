TextLab.AttributeModalDialog = Backbone.View.extend({
    
	template: JST['textlab/templates/attribute-modal-dialog'],
  attributeTemplate: _.template('<%= key %>="<%= value %>" '),
  fieldIDTemplate: _.template('<%= index %>-att-<%= key %>'),

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
    this.config = options.config;
    _.bindAll(this, "renderAttributeField" );
  },

  parseElementFields: function(tag, elementIndex) {
    
    var attributeList = [];    
    _.each( tag.attributes, _.bind( function( attribute, key ) {
      var fieldID = this.fieldIDTemplate({ index: elementIndex, key: key });
      var value = $('#'+fieldID).val();      
      if( attribute.appendTo ) {
        // in this case, append the value to an existing attribute
        var appendTarget = _.find( attributeList, function(attr) { return attr.key == attribute.appendTo; });
        appendTarget.value = appendTarget.value + " " + value;
      } else {
        var pair = { key: key, value: value, attr: attribute };
        attributeList.push( pair );
      }      
    }, this));

    var attributes = " ";
    var zoneOffset = null;
    _.each( attributeList, _.bind( function(pair) {
      var attrString = this.attributeTemplate(pair);    
      
      // use regex to find start offset within attrString and add length of attributes so far
      if( pair.attr.fieldType == 'zone' && pair.value != null ) {
        var match = /="/.exec(attrString);
        zoneOffset = match.index + attributes.length + 2;
      } 

      attributes = attributes + attrString;      
    },this));

    return { tag: tag, attrString: attributes, zoneOffset: zoneOffset };
  },
  
  onCreate: function() {    
    var elementIndex = 0;
    var parentElement = this.parseElementFields(this.tag, elementIndex);

    var children = _.map( this.tag.elements, function( element ) {
      elementIndex = elementIndex + 1;
      return this.parseElementFields(this.config.tags[element], elementIndex);
    }, this);
    
    this.close( _.bind( function() {
      this.callback(parentElement, children);
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

  renderAttributeField: function( elementIndex, attribute, key, zones ) {
    if( attribute.fieldType == 'zone' ) {
      var zoneLabelPrefix = this.model.getZoneLabelPrefix();
      var defaultZone = this.currentZone ? zoneLabelPrefix + this.currentZone.get('zone_label') : '';

      return this.partials.dropdownInput( { 
        field_name: this.fieldIDTemplate({ index: elementIndex, key: key }), 
        field_title: attribute.displayName, 
        field_value: defaultZone, 
        field_instructions: attribute.instructions, 
        no_blank: true,
        options: zones,
        error: false 
      }); 
     } 
    else {
      return this.partials[ attribute.fieldType + 'Input' ]( { 
        field_name: this.fieldIDTemplate({ index: elementIndex, key: key }), 
        field_title: attribute.displayName, 
        field_value: attribute.defaultValue ? attribute.defaultValue : '', 
        field_instructions: attribute.instructions, 
        options: (typeof attribute.vocab === "string") ? this.config.vocabs[attribute.vocab] : attribute.vocab,
        error: false 
      }); 
    }
  },

  render: function() {
    
    // prepare list of options for zone drop down
    var zoneLabelPrefix = this.model.getZoneLabelPrefix();
    var zoneOptions = _.map( this.model.zones.models, function( zone ) {
      var zoneValue = zoneLabelPrefix + zone.get('zone_label');
      return { value: zoneValue, text: zone.get('zone_label') };
    });
    
    var sortedOptions = _.sortBy(zoneOptions, function(opt) {
      return opt.text;
    }, this ); 
        
    this.$el.html(this.template({ 
      tag: this.tag, 
      zones: sortedOptions, 
      config: this.config,
      partials: this.partials,
      renderAttributeField: this.renderAttributeField
    }));

    $('#modal-container').html(this.$el);

    var attributeModal = $('#attributes-modal');

    // add dragging behavior when shown
    attributeModal.on('shown.bs.modal', function (e) {
      attributeModal.draggable({
       handle: ".modal-header"
      });
    });

    attributeModal.modal({ backdrop: false });
  } 
    
});
