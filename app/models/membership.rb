class Membership < ActiveRecord::Base  
  belongs_to :document
  belongs_to :user
    
  def email=(invite_email)
    self.user = User.where( email: invite_email ).first
  end
  
  def obj
    {
      email: self.user.email,
      primary_editor: self.primary_editor,
      secondary_editor: self.secondary_editor      
    }    
  end
  
end