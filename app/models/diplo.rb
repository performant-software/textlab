class Diplo < ActiveRecord::Base
  
  belongs_to :transcription
  
  
  
  
    
  def obj
    { 
      id: self.id,
      html_content: self.html_content
    }
  end
  
end