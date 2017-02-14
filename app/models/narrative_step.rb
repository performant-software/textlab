class NarrativeStep < ActiveRecord::Base
  
  belongs_to :sequence
  belongs_to :zone

  def published_obj
    {
      id: self.id,
      step_number: self.step_number,
      zone_label: self.zone.zone_label,
      step: self.step,
      narrative: self.narrative      
    }
  end
    
  def obj    
    {
      id: self.id,
      sequence_id: self.sequence_id,
      step_number: self.step_number,
      zone_id: self.zone_id,
      step: self.step,
      narrative: self.narrative
    }
  end
    
end