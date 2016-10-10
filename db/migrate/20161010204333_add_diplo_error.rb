class AddDiploError < ActiveRecord::Migration
  def change
    add_column :diplos, :error, :boolean
  end
end
