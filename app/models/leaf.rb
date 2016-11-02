class Leaf < ActiveRecord::Base
  
  has_many :zones, dependent: :destroy
  has_many :zone_links, dependent: :destroy
  has_many :transcriptions, dependent: :destroy
  belongs_to :document
  has_one :document_node, dependent: :destroy
    
  def obj
    
    zonesJSON = self.zones.map { |zone| zone.obj }
    
    { 
      id: self.id,
      name: self.name,
      document_id: self.document_id,
      xml_id: self.xml_id,
      tile_source: self.tile_source,
      next_zone_label: self.next_zone_label,
      zones: zonesJSON
    }
  end
  
end