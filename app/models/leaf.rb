class Leaf < ActiveRecord::Base
  
  has_many :zones, dependent: :destroy
  has_many :zone_links, dependent: :destroy
  belongs_to :document
  has_one :document_node, dependent: :destroy
    
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