namespace :import do
   

   	desc "Load data into the tl_* tables"
	task :load => :environment do
		system('tl_import/import.sh')
	end

	desc "Import data from the tl_* tables"
	task :run => :environment do
		TlUser.import_users!
		TlManuscript.import_manuscripts!
	end

	desc "Drop the tl_* tables"
	task :clear => :environment do
		ActiveRecord::Migration.drop_table(:tl_users)
		ActiveRecord::Migration.drop_table(:tl_manuscripts)
		ActiveRecord::Migration.drop_table(:tl_transcriptions)
		ActiveRecord::Migration.drop_table(:tl_folders)
		ActiveRecord::Migration.drop_table(:tl_leafs)
		ActiveRecord::Migration.drop_table(:tl_revision_sites)
		ActiveRecord::Migration.drop_table(:tl_sequences)
	end

	desc "Publish all official TEI transcriptions"
	task :publish => :environment do
		Document.all.each { |document|
			Transcription.where(document_id: document.id, name: "Official TEI" ).each { |transcription| 
				transcription.published = true
				Diplo.create_diplo!( transcription ) unless transcription.diplo
				transcription.save! 
			}
		}
	end

end
