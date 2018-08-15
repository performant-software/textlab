require 'project_config_loader'

namespace :project_config do

   	desc "Load project configs"
	task :load => :environment do
		ProjectConfigLoader.load_config('tl_config/mel.js')
		ProjectConfigLoader.load_config('tl_config/crane.js')
		ProjectConfigLoader.load_config('tl_config/crane_ms.js')
    ProjectConfigLoader.load_config('tl_config/bow-in-cloud-tl-config.js')
    ProjectConfigLoader.load_config('tl_config/octoroon.js')
    ProjectConfigLoader.remove_old_configs
	end

end
