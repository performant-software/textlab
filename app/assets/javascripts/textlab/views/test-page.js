TextLab.TestPage = Backbone.View.extend({

	template: JST['textlab/templates/test-page'],
    
  id: 'test-page',
            	
	initialize: function(options) {
  },
      
  render: function() {      
    this.$el.html(this.template({}));  
    $(".textlab-app").html(this.$el);
    
    var tileSource = '{"type":"legacy-image-pyramid","levels":[{"url":"https://staging-uploads-juxtaeditions.s3.amazonaws.com/uploads-juxtaeditions.s3.amazonaws.com/uploads/1422303907274-3mlxforsfydjkyb9-35ecdf6c89905871192303efb67f3d16/Page2-3.jpg","width":336,"height":530},{"url":"https://staging-uploads-juxtaeditions.s3.amazonaws.com/uploads-juxtaeditions.s3.amazonaws.com/uploads/1422303907274-3mlxforsfydjkyb9-35ecdf6c89905871192303efb67f3d16/Page2-2.jpg","width":671,"height":1059},{"url":"https://staging-uploads-juxtaeditions.s3.amazonaws.com/uploads-juxtaeditions.s3.amazonaws.com/uploads/1422303907274-3mlxforsfydjkyb9-35ecdf6c89905871192303efb67f3d16/Page2-1.jpg","width":1342,"height":2117},{"url":"https://staging-uploads-juxtaeditions.s3.amazonaws.com/uploads/1422303907274-3mlxforsfydjkyb9-35ecdf6c89905871192303efb67f3d16/Page2.jpg","width":2683,"height":4234}]}';
    
		this.seaDragonViewer = OpenSeadragon({
			id : "openseadragon",
			prefixUrl : "/openseadragon/",
			tileSources : tileSource,
			maxZoomPixelRatio : 5,
			springStiffness: 20,
			zoomPerClick: 1.5
		});
            
  }
  
  
});