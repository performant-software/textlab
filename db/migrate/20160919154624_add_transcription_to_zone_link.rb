class AddTranscriptionToZoneLink < ActiveRecord::Migration
  def change
    add_column :zone_links, :transcription_id, :integer
  end
end
