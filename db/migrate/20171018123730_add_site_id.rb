class AddSiteId < ActiveRecord::Migration
  def change
  	add_column :users, :site_id, :integer
  end
end
