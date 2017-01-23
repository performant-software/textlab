class ProjectConfig < ActiveRecord::Base
      
  def obj
    { 
      id: self.id,
      vocabs: self.vocabs,
      tags: self.tags
    }
  end
  
end