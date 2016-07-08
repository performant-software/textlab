class ZoneLink < ActiveRecord::Base
  
  belongs_to :leaf
    
  def obj
    { 
      id: self.id,
      zone_label: self.zone_label,
      offset: self.offset,
      leaf_id: self.leaf_id
    }
  end
  
end