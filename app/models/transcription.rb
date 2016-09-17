class Transcription < ActiveRecord::Base
  
  belongs_to :document
  belongs_to :user
  belongs_to :leaf
    
  def obj
    {
      id: self.id,
      leaf_id: self.leaf_id,
      name: self.name,
      content: self.content,
      shared: self.shared,
      submitted: self.submitted
    }
  end
    
end