TextLab.ZoneLink = Backbone.Model.extend({
  urlRoot: "zone_links",
    
});

TextLab.ZoneLinkCollection = Backbone.Collection.extend({
  model: TextLab.ZoneLink,
  url: "zone_links"
}); 
