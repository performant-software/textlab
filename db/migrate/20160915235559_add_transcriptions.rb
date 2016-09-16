class AddTranscriptions < ActiveRecord::Migration
  def change
    create_table :transcriptions do |t|
      t.string :name
      t.text :content
      t.integer :leaf_id
      t.integer :document_id
      t.integer :user_id
      t.boolean :shared
      t.boolean :submitted
      t.timestamps null: false
    end
  end
end
