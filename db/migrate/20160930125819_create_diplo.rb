class CreateDiplo < ActiveRecord::Migration
  def change
    create_table :diplos do |t|
      t.integer :transcription_id
      t.text :html_content
    end
  end
end
