
alter table users rename to tl_users;

alter table manuscript rename to tl_manuscripts;

ALTER TABLE transcription RENAME COLUMN createdon TO created_at;
ALTER TABLE transcription RENAME COLUMN lastupdatedon TO updated_at;
ALTER TABLE transcription ADD COLUMN transcription_type text;
update transcription set transcription_type = type;
ALTER TABLE transcription DROP COLUMN type;
alter table transcription rename column parent_folder to tl_folder_id;
alter table transcription rename to tl_transcriptions;

ALTER TABLE folder ADD COLUMN folder_type text;
update folder set folder_type = type;
ALTER TABLE folder DROP COLUMN type;
-- alter table folder add primary key (id);
alter table folder rename to tl_folders;

ALTER TABLE leaf RENAME COLUMN id TO leaf_guid;
alter table leaf rename to tl_leafs;

alter table revisionsite rename to tl_revision_sites;

update tl_leafs set createdby='jbryant' where createdby='admin';
update tl_manuscripts set userid='jbryant' where userid='admin';
update tl_transcriptions set ownedby='jbryant' where ownedby='admin';