
class ProjectConfigLoader
  
	def self.load_config(filepath, make_default=false)
		config_data = ProjectConfigLoader.read_json_file(filepath)
		project_config = ProjectConfig.new(config_data)
		project_config.save!

		if make_default
			Document.all.each { |doc|
				doc.project_config_id = project_config.id
				doc.save!
			}
		end
	end


	def self.read_json_file( filepath )
		buf = []
		File.open(filepath, "r") do |f|
		  f.each_line do |line|
		    buf.push line
		  end
		end

		json_string = buf.join    
		JSON.parse(json_string)
	end

end