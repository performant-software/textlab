class AddTranscriptionIdToZones < ActiveRecord::Migration
  def change
    # Add the transcription_id column
    add_reference :zones, :transcription, index: true, foreign_key: true

    # TODO: Comment me
    execute <<-SQL.squish
        WITH first_transcriptions AS (
      SELECT a.id, a.leaf_id
        FROM transcriptions a
        LEFT JOIN transcriptions b ON b.leaf_id = a.leaf_id
                                    AND b.created_at < a.created_at
       WHERE b.id IS NULL
      )
      UPDATE zones z
         SET transcription_id = ft.id
        FROM first_transcriptions ft
       WHERE ft.leaf_id = z.leaf_id
    SQL

    # Copy the zones for all transcriptions (exclude transcriptions that already have zones)
    execute <<-SQL.squish
      INSERT INTO zones (ulx, uly, lrx, lry, zone_label, transcription_id, created_at, updated_at)
      SELECT zones.ulx, zones.uly, zones.lrx, zones.lry, zones.zone_label, transcriptions.id, zones.created_at, zones.updated_at
        FROM zones
        JOIN leafs ON leafs.id = zones.leaf_id
        LEFT JOIN transcriptions ON transcriptions.leaf_id = leafs.id
       WHERE NOT EXISTS ( SELECT 1
                            FROM zones z
                           WHERE z.transcription_id = transcriptions.id )
    SQL

    # Remove the leaf_id column
    remove_reference :zones, :leaf
  end
end
