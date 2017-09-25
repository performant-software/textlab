# NOTE: This class is only used for migrating data from the previous version of TextLab

class TlUser < ActiveRecord::Base  

	def self.import_users!
		TlUser.where( disabled: false ).each { |tl_user|
			tl_user.convert_username!
			tl_user.email = tl_user.email.downcase
			tl_user.import_user!
		}
	end

	# usernames cannot contain ., -, _ 
	def convert_username!
		original_name = self.username
		converted_name = original_name.gsub ".", ""			
		converted_name = converted_name.gsub "-", ""			
		converted_name = converted_name.gsub "_", ""	
		return if original_name == converted_name

		# tl_users.username
		self.username = converted_name

		# tl_manuscripts.userid
		TlManuscript.where( userid: original_name ).each { |tl_manuscript|
			tl_manuscript.userid = converted_name
			tl_manuscript.save!
		}

		# tl_sequences.ownedby
		TlSequence.where( ownedby: original_name ).each { |tl_sequence|
			tl_sequence.ownedby = converted_name
			tl_sequence.save!
		}

		# tl_transcriptions.ownedby
		TlTranscription.where( ownedby: original_name ).each { |tl_transcription|
			tl_transcription.ownedby = converted_name
			tl_transcription.save!
		}

		# tl_leafs.createdby
		TlLeaf.where( createdby: original_name ).each { |tl_leaf|
			tl_leaf.createdby = converted_name
			tl_leaf.save!
		}

		# tl_leafs.lastupdatedby
		TlLeaf.where( lastupdatedby: original_name ).each { |tl_leaf|
			tl_leaf.lastupdatedby = converted_name
			tl_leaf.save!
		}
	end

	def import_user!
		user = User.find_by( email: self.email )

		if user.nil?
			user = User.new( {
				username: self.username,
				first_name: self.firstname,
				last_name: self.lastname,
				email: self.email,
				password: ENV['IMPORTED_USER_PASSWORD'],
				password_confirmation: ENV['IMPORTED_USER_PASSWORD']
			})

			user.save!
		else
			# if the account already exists, make sure Tl2 username == Tl1 username
			unless user.username == self.username
				user.username = self.username
				user.save!
			end 
		end

	end

end