class AddMemberships < ActiveRecord::Migration
  def change
    create_table :memberships do |t|
      t.integer :document_id
      t.integer :user_id
      t.boolean :primary_editor
      t.boolean :secondary_editor
      t.timestamps null: false
    end
  end
end
