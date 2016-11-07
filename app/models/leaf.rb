class Leaf < ActiveRecord::Base
  
  has_many :zones, dependent: :destroy
  has_many :zone_links, dependent: :destroy
  has_many :transcriptions, dependent: :destroy
  belongs_to :document
  has_one :document_node, dependent: :destroy
  
  def get_transcription_objs( user_id )
    project_owner = self.document.is_owner?(user_id)
    transcriptions = []
    self.transcriptions.each { |t|      
      if user_id == t.user_id || t.shared || (t.submitted and project_owner)
        transcriptions << t.obj(user_id)
      end
    }
    transcriptions
  end

  def published_transcription
    self.transcriptions.find_by( published: true )
  end
  
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