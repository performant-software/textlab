
alter table users rename to tl_users;

alter table manuscript rename to tl_manuscripts;

ALTER TABLE transcription RENAME COLUMN createdon TO created_at;
ALTER TABLE transcription RENAME COLUMN lastupdatedon TO updated_at;
-- ALTER TABLE transcription ADD COLUMN transcription_type text;
-- update transcription set transcription_type = type;
-- ALTER TABLE transcription DROP COLUMN type;
alter table transcription rename column parent_folder to folder_id;
alter table transcription rename to tl_transcriptions;

-- ALTER TABLE folders ADD COLUMN folder_type text;
-- update folders set folder_type = type;
-- ALTER TABLE folders DROP COLUMN type;
-- alter table folders add primary key (id);
alter table folders rename to tl_folders;

ALTER TABLE leaf RENAME COLUMN id TO leaf_guid;
alter table leaf rename to tl_leafs;

alter table revisionsite rename to tl_revision_sites;