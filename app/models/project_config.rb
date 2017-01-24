class ProjectConfig < ActiveRecord::Base
      
  def obj
    { 
      id: self.id,
      name: self.name,
      description: self.description,
      vocabs: self.vocabs,
      tags: self.tags
    }
  end
  
end