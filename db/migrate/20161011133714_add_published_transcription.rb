class AddPublishedTranscription < ActiveRecord::Migration
  def change
    add_column :transcriptions, :published, :boolean
  end
end
