class Membership < ActiveRecord::Base  
  belongs_to :document
  belongs_to :user
    
  def username=(invite_username)
    self.user = User.where( username: invite_username ).first
  end
  
  def obj
    {
      id: self.id,
      email: self.user.email,
      username: self.user.username,
      first_name: self.user.first_name,
      last_name: self.user.last_name,
      primary_editor: self.primary_editor,
      secondary_editor: self.secondary_editor,
      accepted: self.accepted     
    }    
  end
  
end