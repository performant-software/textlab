class AddSites < ActiveRecord::Migration
  def change
  	create_table :sites do |t|
      t.string :name
      t.integer :max_accounts
      t.timestamps null: false
    end
  end
end
