class Transcription < ActiveRecord::Base
  
  belongs_to :document
  belongs_to :user
  belongs_to :leaf
  has_many :zone_links, dependent: :destroy
  has_one :diplo, dependent: :destroy
  
  def self.get_all( leaf_id, user_id )
    transcriptions = Transcription.where( "leaf_id = ? and (shared = true or user_id = ?)", leaf_id, user_id )
    transcriptions.map { |transcription| transcription.obj(user_id) }        
  end

  def zone_links_json=( proposed_zone_links )    
    self.zone_links.clear
    proposed_zone_links.each { |zone_link_obj|      
      self.zone_links << ZoneLink.new(zone_link_obj)
    } unless proposed_zone_links.nil?  
  end
  
  # go through the content detecting zone links, associate them with leaf and transcription
  def generate_zone_links!
    return if self.content.blank?
    
    match_data = self.content.match(/(#img_\d+-\d+)/ )        

    while match_data != nil
      position =  match_data.end(1)
      zone_link = ZoneLink.new({
        zone_label: match_data[1].match(/#img_\d+-(\d+)/)[1],
        offset: match_data.begin(1),
        leaf_id: self.leaf_id,
        transcription_id: self.id
      })
      zone_link.save!    
      match_data = self.content.match(/(#img_\d+-\d+)/, position )        
    end
  end
  
  def obj(current_user_id=nil)
    
    zoneLinksJSON = self.zone_links.map { |zone_link| zone_link.obj }
    owner = ( current_user_id == self.user_id ) 
    
    {
      id: self.id,
      name: self.name,
      content: self.content,
      zone_links: zoneLinksJSON,
      shared: self.shared,
      submitted: self.submitted,
      published: self.published,
      owner: owner
    }
  end
    
end