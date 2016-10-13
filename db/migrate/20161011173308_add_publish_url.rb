class AddPublishUrl < ActiveRecord::Migration
  def change
    add_column :documents, :published, :boolean
  end
end
