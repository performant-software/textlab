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
			Transcription.where(document_id: document.id, user_id: document.user_id ).each { |transcription|
				# does the name of this transcription match the name of the parent folder of this leaf?
				node = transcription.leaf.document_node
				unless node.parent_node.nil? or node.parent_node.document_section.nil?
					folder_name = node.parent_node.document_section.name
					if folder_name == transcription.name
						# if name matches, publish this transcription.
						transcription.published = true
						transcription.shared = true
						Diplo.create_diplo!( transcription ) unless transcription.diplo
						transcription.save! 
					end
				end
			}
		}
	end

end
