class RemoveZoneLinks < ActiveRecord::Migration
	def change
       drop_table :zone_links
     end
end
