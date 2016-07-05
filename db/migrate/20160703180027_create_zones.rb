class CreateZones < ActiveRecord::Migration
  def change
    create_table :zones do |t|
      t.integer :ulx
      t.integer :uly
      t.integer :lrx
      t.integer :lry
      t.string :zone_label
      t.integer :leaf_id
      t.timestamps null: false
    end
  end
end
