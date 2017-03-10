class NarrativeStep < ActiveRecord::Base
  
  belongs_to :sequence
  belongs_to :zone

  after_destroy do |doomed|
    steps = doomed.sequence.narrative_steps.order('step_number')

    i = 0
    steps.each { |step| 
      step.step_number = i 
      step.save!
      i = i + 1
    }    
  end

  def new_step_number=(new_step_num)    
    old_number = self.step_number
    step = self.sequence.narrative_steps.where( step_number: new_step_num ).first
    step.step_number = old_number
    self.step_number = new_step_num
    step.save!
  end
  
  def published_obj
    {
      id: self.id,
      step_number: self.step_number,
      zone_label: self.zone.nil? ? "" : self.zone.zone_label,
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