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

ActiveRecord::Schema.define(version: 20170131193302) do

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

  create_table "tl_folders", id: :bigserial, force: :cascade do |t|
    t.text "name",          null: false
    t.text "manuscript_id", null: false
    t.text "folder_type"
  end

  create_table "tl_leafs", id: false, force: :cascade do |t|
    t.text     "leaf_guid",                   default: "0", null: false
    t.text     "name",                                      null: false
    t.text     "manuscriptid",                default: "0", null: false
    t.integer  "orderno",           limit: 8
    t.text     "createdby"
    t.datetime "createdon",                                 null: false
    t.text     "lastupdatedby"
    t.datetime "lastupdatedon"
    t.text     "imageid"
    t.integer  "chapterid",         limit: 8
    t.text     "publishedbasetext"
  end

  create_table "tl_revision_sites", id: false, force: :cascade do |t|
    t.text    "id",                null: false
    t.text    "polygon"
    t.text    "leafid"
    t.integer "sitenum", limit: 8
  end

  create_table "tl_transcriptions", id: false, force: :cascade do |t|
    t.text     "id",                           null: false
    t.text     "manuscriptid",                 null: false
    t.text     "ownedby"
    t.text     "name"
    t.datetime "created_at"
    t.datetime "updated_at"
    t.datetime "publishedon"
    t.datetime "sharedon"
    t.text     "transcriptiontext"
    t.integer  "tl_folder_id",       limit: 8
    t.text     "transcription_type"
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
