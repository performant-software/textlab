# encoding: UTF-8
# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# Note that this schema.rb definition is the authoritative source for your
# database schema. If you need to create the application database on another
# system, you should be using db:schema:load, not running all the migrations
# from scratch. The latter is a flawed and unsustainable approach (the more migrations
# you'll amass, the slower it'll run and the greater likelihood for issues).
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema.define(version: 20171108114437) do

  # These are extensions that must be enabled in order to support this database
  enable_extension "plpgsql"

  create_table "diplos", force: :cascade do |t|
    t.integer "transcription_id"
    t.text    "html_content"
    t.boolean "error"
  end

  create_table "document_nodes", force: :cascade do |t|
    t.integer  "position"
    t.integer  "document_node_id"
    t.integer  "document_id"
    t.integer  "leaf_id"
    t.integer  "document_section_id"
    t.datetime "created_at",          null: false
    t.datetime "updated_at",          null: false
  end

  create_table "document_sections", force: :cascade do |t|
    t.string   "name"
    t.integer  "document_id"
    t.datetime "created_at",  null: false
    t.datetime "updated_at",  null: false
  end

  create_table "documents", force: :cascade do |t|
    t.string   "name"
    t.datetime "created_at",        null: false
    t.datetime "updated_at",        null: false
    t.string   "description"
    t.integer  "user_id"
    t.boolean  "published"
    t.integer  "project_config_id"
  end

  create_table "leafs", force: :cascade do |t|
    t.string   "name"
    t.text     "tile_source"
    t.integer  "next_zone_label", default: 1, null: false
    t.integer  "document_id"
    t.datetime "created_at",                  null: false
    t.datetime "updated_at",                  null: false
    t.string   "xml_id"
  end

  create_table "memberships", force: :cascade do |t|
    t.integer  "document_id"
    t.integer  "user_id"
    t.boolean  "primary_editor"
    t.boolean  "secondary_editor"
    t.datetime "created_at",       null: false
    t.datetime "updated_at",       null: false
    t.boolean  "accepted"
  end

  create_table "narrative_steps", force: :cascade do |t|
    t.integer "sequence_id"
    t.integer "zone_id"
    t.integer "step_number"
    t.text    "step"
    t.text    "narrative"
  end

  create_table "project_configs", force: :cascade do |t|
    t.string "name"
    t.string "description"
    t.text   "vocabs"
    t.text   "tags"
  end

  create_table "sequences", force: :cascade do |t|
    t.integer "leaf_id"
    t.string  "name"
    t.integer "document_id"
    t.integer "user_id"
    t.boolean "shared"
    t.boolean "submitted"
    t.boolean "published"
  end

  create_table "sites", force: :cascade do |t|
    t.string   "name"
    t.integer  "max_accounts"
    t.datetime "created_at",   null: false
    t.datetime "updated_at",   null: false
  end

  create_table "tl_folders", id: :bigserial, force: :cascade do |t|
    t.string "name",          limit: 45, null: false
    t.string "manuscript_id", limit: 36, null: false
    t.text   "folder_type"
  end

  create_table "tl_leafs", primary_key: "leaf_guid", force: :cascade do |t|
    t.string   "name",              limit: 255,               null: false
    t.string   "manuscriptid",      limit: 36,  default: "0", null: false
    t.integer  "orderno",           limit: 8
    t.string   "createdby",         limit: 45
    t.datetime "createdon",                                   null: false
    t.string   "lastupdatedby",     limit: 45
    t.datetime "lastupdatedon"
    t.string   "imageid",           limit: 75
    t.integer  "chapterid",         limit: 8
    t.text     "publishedbasetext"
  end

  add_index "tl_leafs", ["manuscriptid"], name: "idx_347180_manuscriptid", using: :btree
  add_index "tl_leafs", ["orderno"], name: "idx_347180_orderno", using: :btree

  create_table "tl_manuscripts", force: :cascade do |t|
    t.string   "name",          limit: 75,  null: false
    t.string   "userid",        limit: 45
    t.datetime "datecreated",               null: false
    t.string   "author",        limit: 100, null: false
    t.datetime "datepublished"
    t.string   "catalogsource", limit: 64
    t.integer  "readingtextid", limit: 8
  end

  create_table "tl_revision_sites", force: :cascade do |t|
    t.string  "polygon", limit: 512
    t.string  "leafid",  limit: 36
    t.integer "sitenum", limit: 8
  end

  add_index "tl_revision_sites", ["leafid"], name: "idx_347240_leafid", using: :btree

  create_table "tl_sequences", primary_key: "sequence_guid", force: :cascade do |t|
    t.string   "manuscriptid",  limit: 36,  null: false
    t.string   "ownedby",       limit: 45
    t.string   "name",          limit: 256
    t.datetime "createdon"
    t.datetime "lastupdatedon"
    t.datetime "publishedon"
    t.datetime "sharedon"
    t.text     "sequencexml"
    t.integer  "parent_folder", limit: 8
    t.string   "guid",          limit: 36
  end

  add_index "tl_sequences", ["manuscriptid", "ownedby"], name: "idx_347252_manuscriptidusername", using: :btree

  create_table "tl_transcriptions", force: :cascade do |t|
    t.string   "manuscriptid",       limit: 36,  null: false
    t.string   "ownedby",            limit: 45
    t.string   "name",               limit: 256
    t.datetime "created_at"
    t.datetime "updated_at"
    t.datetime "publishedon"
    t.datetime "sharedon"
    t.text     "transcriptiontext"
    t.integer  "tl_folder_id",       limit: 8
    t.text     "transcription_type"
  end

  add_index "tl_transcriptions", ["manuscriptid", "ownedby"], name: "idx_347279_manuscriptidusername", using: :btree

  create_table "tl_users", primary_key: "username", force: :cascade do |t|
    t.string   "firstname",   limit: 45,   null: false
    t.string   "lastname",    limit: 45,   null: false
    t.string   "email",       limit: 150,  null: false
    t.string   "password",    limit: 1024, null: false
    t.boolean  "disabled",                 null: false
    t.datetime "datecreated",              null: false
  end

  create_table "transcriptions", force: :cascade do |t|
    t.string   "name"
    t.text     "content"
    t.integer  "leaf_id"
    t.integer  "document_id"
    t.integer  "user_id"
    t.boolean  "shared"
    t.boolean  "submitted"
    t.datetime "created_at",  null: false
    t.datetime "updated_at",  null: false
    t.boolean  "published"
  end

  create_table "users", force: :cascade do |t|
    t.string   "email",                  default: "", null: false
    t.string   "encrypted_password",     default: "", null: false
    t.string   "reset_password_token"
    t.datetime "reset_password_sent_at"
    t.datetime "remember_created_at"
    t.integer  "sign_in_count",          default: 0,  null: false
    t.datetime "current_sign_in_at"
    t.datetime "last_sign_in_at"
    t.inet     "current_sign_in_ip"
    t.inet     "last_sign_in_ip"
    t.datetime "created_at",                          null: false
    t.datetime "updated_at",                          null: false
    t.string   "username"
    t.string   "first_name"
    t.string   "last_name"
    t.string   "user_type"
    t.integer  "site_id"
    t.string   "account_status"
    t.boolean  "validated"
  end

  add_index "users", ["email"], name: "index_users_on_email", unique: true, using: :btree
  add_index "users", ["reset_password_token"], name: "index_users_on_reset_password_token", unique: true, using: :btree

  create_table "zone_links", force: :cascade do |t|
    t.string   "zone_label"
    t.integer  "offset"
    t.integer  "leaf_id"
    t.datetime "created_at",       null: false
    t.datetime "updated_at",       null: false
    t.integer  "transcription_id"
  end

  create_table "zones", force: :cascade do |t|
    t.integer  "ulx"
    t.integer  "uly"
    t.integer  "lrx"
    t.integer  "lry"
    t.string   "zone_label"
    t.integer  "leaf_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

end
