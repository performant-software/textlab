class ZoneLink < ActiveRecord::Base
  
  belongs_to :leaf
  belongs_to :transcription
    
  def obj
    { 
      id: self.id,
      zone_label: self.zone_label,
      offset: self.offset
    }
  end
  
end