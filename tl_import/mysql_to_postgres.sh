# this script requires pg_loader (http://pgloader.io/)

psql -f reset.sql
pgloader mysql://root@localhost/tl_prod postgresql:///textlab 
pg_dump -O -Fc textlab > dmp/tl_prod.dmp