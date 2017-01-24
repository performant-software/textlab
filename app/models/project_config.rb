class ProjectConfig < ActiveRecord::Base
      
	def self.get_all
		project_configs = ProjectConfig.all
		project_configs.map { |project_config| project_config.list_obj() }
	end  

	def list_obj
	{ 
	  id: self.id,
	  name: self.name
	}
	end

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