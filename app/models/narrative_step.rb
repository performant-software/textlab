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
    # renumber the other steps and assign this step this number.
    steps = self.sequence.narrative_steps.order('step_number')
    i = new_step_num + 1
    steps.each { |step|
      # make a space at this point in the sequence, don't order self
      if step.id != self.id
        if step.step_number >= new_step_num
          step.step_number = i
          step.save!
          i = i + 1
        end
      end
    }
    self.step_number = new_step_num
  end
  
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