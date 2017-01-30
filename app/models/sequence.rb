class Sequence < ActiveRecord::Base
  
  belongs_to :document
  belongs_to :user
  belongs_to :leaf
    
  def obj(current_user_id=nil)
    
    owner = ( current_user_id == self.user_id ) 
    
    {
      id: self.id,
      name: self.name,
      shared: self.shared,
      submitted: self.submitted,
      published: self.published,
      owner: owner
    }
  end
    
end