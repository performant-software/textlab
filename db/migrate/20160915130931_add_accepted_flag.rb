class AddAcceptedFlag < ActiveRecord::Migration
  def change
    add_column :memberships, :accepted, :boolean  
  end
end
