# NOTE: This class is only used for migrating data from the previous version of TextLab

class TlUser < ActiveRecord::Base  

	def self.import_users!

		TlUser.where( disabled: false ).each { |tl_user|
			tl_user.import_user!
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

			user.save
		else
			# if the account already exists, make sure Tl2 username == Tl1 username
			unless user.username == self.username
				user.username = self.username
				user.save
			end 
		end

	end

end