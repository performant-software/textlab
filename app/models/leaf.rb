class Leaf < ActiveRecord::Base
  
  has_many :zones, dependent: :destroy
  has_many :zone_links, dependent: :destroy
  belongs_to :document
  
  def self.test_source
'{"type":"legacy-image-pyramid","levels":[{"url":"https://staging-uploads-juxtaeditions.s3.amazonaws.com/uploads-juxtaeditions.s3.amazonaws.com/uploads/1422303907274-3mlxforsfydjkyb9-35ecdf6c89905871192303efb67f3d16/Page2-3.jpg","width":336,"height":530},{"url":"https://staging-uploads-juxtaeditions.s3.amazonaws.com/uploads-juxtaeditions.s3.amazonaws.com/uploads/1422303907274-3mlxforsfydjkyb9-35ecdf6c89905871192303efb67f3d16/Page2-2.jpg","width":671,"height":1059},{"url":"https://staging-uploads-juxtaeditions.s3.amazonaws.com/uploads-juxtaeditions.s3.amazonaws.com/uploads/1422303907274-3mlxforsfydjkyb9-35ecdf6c89905871192303efb67f3d16/Page2-1.jpg","width":1342,"height":2117},{"url":"https://staging-uploads-juxtaeditions.s3.amazonaws.com/uploads/1422303907274-3mlxforsfydjkyb9-35ecdf6c89905871192303efb67f3d16/Page2.jpg","width":2683,"height":4234}]}'
  end
  
  def zone_links_json=( proposed_zone_links )    
    self.zone_links.clear
    proposed_zone_links.each { |zone_link_obj|      
      self.zone_links << ZoneLink.new(zone_link_obj)
    } unless proposed_zone_links.nil?  
  end
  
  def obj
    
    zonesJSON = self.zones.map { |zone| zone.obj }
    zoneLinksJSON = self.zone_links.map { |zone_link| zone_link.obj }
    
    { 
      id: self.id,
      name: self.name,
      tile_source: self.tile_source,
      content: self.content,
      next_zone_label: self.next_zone_label,
      zones: zonesJSON,
      zone_links: zoneLinksJSON
    }
  end
  
end