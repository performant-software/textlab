class Transcription < ActiveRecord::Base
  
  belongs_to :document
  belongs_to :user
  belongs_to :leaf
  has_many :zone_links, dependent: :destroy
  
  def self.get_all( leaf_id, user_id )
    transcriptions = Transcription.where( { leaf_id: leaf_id, user_id: user_id } )
    transcriptions.map { |transcription| transcription.obj }        
  end

  def zone_links_json=( proposed_zone_links )    
    self.zone_links.clear
    proposed_zone_links.each { |zone_link_obj|      
      self.zone_links << ZoneLink.new(zone_link_obj)
    } unless proposed_zone_links.nil?  
  end
      
  def obj
    
    zoneLinksJSON = self.zone_links.map { |zone_link| zone_link.obj }
    
    {
      id: self.id,
      name: self.name,
      content: self.content,
      zone_links: zoneLinksJSON,
      shared: self.shared,
      submitted: self.submitted
    }
  end
    
end