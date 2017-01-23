class AddConfigId < ActiveRecord::Migration
  def change
  	add_column :documents, :project_config_id, :integer
  end
end
