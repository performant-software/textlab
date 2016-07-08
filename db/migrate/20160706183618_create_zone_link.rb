class CreateZoneLink < ActiveRecord::Migration
  def change
    create_table :zone_links do |t|
      t.string :zone_label
      t.integer :offset
      t.integer :leaf_id
      t.timestamps null: false
    end
  end
end
