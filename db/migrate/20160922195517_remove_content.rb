class RemoveContent < ActiveRecord::Migration
  def change
    remove_column :leafs, :content, :text
  end
end
