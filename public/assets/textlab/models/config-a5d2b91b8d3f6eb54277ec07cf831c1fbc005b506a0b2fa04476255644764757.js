TextLab.Config = Backbone.Model.extend({
  urlRoot: "project_configs"
  
  
});

TextLab.ConfigCollection = Backbone.Collection.extend({
  model: TextLab.Config,
  url: "project_configs"
  
}); 
