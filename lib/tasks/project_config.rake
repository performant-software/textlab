require 'project_config_loader'

namespace :project_config do
   
   	desc "Load project configs"
	task :load => :environment do
		ProjectConfigLoader.load_config('tl_config/mel.js', true)
		ProjectConfigLoader.load_config('tl_config/crane.js')
	end

end
