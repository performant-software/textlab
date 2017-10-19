class AddAccountStatus < ActiveRecord::Migration
  def change
  	add_column :users, :account_status, :string
  end
end
