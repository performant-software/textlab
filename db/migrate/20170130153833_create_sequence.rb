class CreateSequence < ActiveRecord::Migration
  def change
    create_table :sequences do |t|
      t.integer :leaf_id
      t.string :name
      t.integer :document_id
      t.integer :user_id
      t.boolean :shared
      t.boolean :submitted
      t.boolean :published
    end
  end
end
