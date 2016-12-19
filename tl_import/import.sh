
psql -f tl_import/reset.sql

pg_restore -O -d textlab tl_import/dmp/tl_prod.dmp

psql textlab -f tl_import/import.sql

pg_dump -O -t tl_users -Fc textlab > tl_import/dmp/tl_users.dmp
pg_dump -O -t tl_manuscripts -Fc textlab > tl_import/dmp/tl_manuscripts.dmp
pg_dump -O -t tl_transcriptions -Fc textlab > tl_import/dmp/tl_transcriptions.dmp
pg_dump -O -t tl_folders -Fc textlab > tl_import/dmp/tl_folders.dmp
pg_dump -O -t tl_leafs -Fc textlab > tl_import/dmp/tl_leafs.dmp
pg_dump -O -t tl_revision_sites -Fc textlab > tl_import/dmp/tl_revision_sites.dmp

pg_restore -O -d tl tl_import/dmp/tl_users.dmp
pg_restore -O -d tl tl_import/dmp/tl_manuscripts.dmp
pg_restore -O -d tl tl_import/dmp/tl_transcriptions.dmp
pg_restore -O -d tl tl_import/dmp/tl_folders.dmp
pg_restore -O -d tl tl_import/dmp/tl_leafs.dmp
pg_restore -O -d tl tl_import/dmp/tl_revision_sites.dmp
