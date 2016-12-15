
psql -f reset.sql

pg_restore -O -d textlab dmp/tl_prod.dmp

psql textlab -f import.sql

pg_dump -O -t tl_users -Fc textlab > dmp/tl_users.dmp
pg_dump -O -t tl_manuscripts -Fc textlab > dmp/tl_manuscripts.dmp
pg_dump -O -t tl_transcriptions -Fc textlab > dmp/tl_transcriptions.dmp
pg_dump -O -t tl_folders -Fc textlab > dmp/tl_folders.dmp
pg_dump -O -t tl_leafs -Fc textlab > dmp/tl_leafs.dmp
pg_dump -O -t tl_revision_sites -Fc textlab > dmp/tl_revision_sites.dmp

pg_restore -O -d tl dmp/tl_users.dmp
pg_restore -O -d tl dmp/tl_manuscripts.dmp
pg_restore -O -d tl dmp/tl_transcriptions.dmp
pg_restore -O -d tl dmp/tl_folders.dmp
pg_restore -O -d tl dmp/tl_leafs.dmp
pg_restore -O -d tl dmp/tl_revision_sites.dmp
