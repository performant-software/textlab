class AddSections < ActiveRecord::Migration
  def change
    create_table :document_sections do |t|
      t.string :name
      t.integer :document_id
      t.timestamps null: false
    end
  end
end
