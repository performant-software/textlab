class CreateLeaf < ActiveRecord::Migration
  def change
    create_table :leafs do |t|
      t.string :name
      t.text :tile_source
      t.text :content
      t.integer :document_id
      t.timestamps null: false
    end
  end
end
