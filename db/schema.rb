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
# It's strongly recommended to check this file into your version control system.

ActiveRecord::Schema.define(:version => 20101123084846) do

  create_table "delayed_jobs", :force => true do |t|
    t.integer  "priority",   :default => 0
    t.integer  "attempts",   :default => 0
    t.text     "handler"
    t.text     "last_error"
    t.datetime "run_at"
    t.datetime "locked_at"
    t.datetime "failed_at"
    t.string   "locked_by"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  add_index "delayed_jobs", ["priority", "run_at"], :name => "delayed_jobs_priority"

  create_table "events", :force => true do |t|
    t.string   "title"
    t.string   "description"
    t.datetime "created_at"
    t.datetime "updated_at"
    t.boolean  "electronic_tickets"
    t.boolean  "permanent"
  end

  create_table "events_users", :id => false, :force => true do |t|
    t.integer "event_id"
    t.integer "user_id"
  end

  create_table "registration_batches", :force => true do |t|
    t.string   "note"
    t.text     "data"
    t.integer  "event_id"
    t.datetime "created_at"
    t.datetime "updated_at"
    t.datetime "imported_at"
  end

  create_table "registrations", :force => true do |t|
    t.integer  "event_id"
    t.integer  "visitor_id"
    t.integer  "registration_batch_id"
    t.string   "note"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "studentkoll", :id => false, :force => true do |t|
    t.string   "epost"
    t.string   "fornamn"
    t.string   "efternamn"
    t.string   "pnr_format"
    t.string   "rfidnr"
    t.string   "streckkodnr"
    t.datetime "giltig_till"
    t.string   "kar"
    t.string   "blockerat"
  end

  create_table "students", :force => true do |t|
    t.string   "first_name"
    t.string   "last_name"
    t.string   "personal_number"
    t.string   "rfid_number"
    t.string   "barcode_number"
    t.string   "email"
    t.datetime "expire_at"
    t.boolean  "blocked"
    t.boolean  "union_member"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  add_index "students", ["first_name", "last_name", "personal_number", "rfid_number", "barcode_number", "email"], :name => "search_index", :unique => true

  create_table "sture_students", :force => true do |t|
    t.string   "personal_number"
    t.string   "student_union"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "ticket_types", :force => true do |t|
    t.string   "name"
    t.string   "description"
    t.integer  "price"
    t.integer  "union_discount"
    t.integer  "maximum_number_of_tickets"
    t.integer  "event_id"
    t.datetime "created_at"
    t.datetime "updated_at"
    t.integer  "number_of_extra_discount_tickets"
    t.integer  "extra_discount_count"
    t.integer  "extra_discount"
    t.boolean  "always_save"
    t.string   "extra_discount_for_union"
    t.datetime "enable_extra_discount_at"
    t.datetime "disable_extra_discount_at"
    t.boolean  "use_time_to_enable_extra_discount"
  end

  create_table "tickets", :force => true do |t|
    t.string   "note"
    t.integer  "ticket_type_id"
    t.integer  "registration_id"
    t.integer  "handed_out_by"
    t.datetime "handed_out_at"
    t.string   "handout_location"
    t.datetime "emailed_at"
    t.datetime "created_at"
    t.datetime "updated_at"
    t.boolean  "extra_discount"
    t.string   "union_discount"
    t.boolean  "union_override"
    t.integer  "created_by"
  end

  create_table "users", :force => true do |t|
    t.string   "email",                               :default => "",    :null => false
    t.string   "encrypted_password",   :limit => 128, :default => "",    :null => false
    t.string   "password_salt",                       :default => "",    :null => false
    t.string   "reset_password_token"
    t.string   "remember_token"
    t.datetime "remember_created_at"
    t.integer  "sign_in_count",                       :default => 0
    t.datetime "current_sign_in_at"
    t.datetime "last_sign_in_at"
    t.string   "current_sign_in_ip"
    t.string   "last_sign_in_ip"
    t.datetime "created_at"
    t.datetime "updated_at"
    t.boolean  "admin",                               :default => false
    t.string   "username"
    t.string   "api_key"
  end

  add_index "users", ["email"], :name => "index_users_on_email", :unique => true
  add_index "users", ["reset_password_token"], :name => "index_users_on_reset_password_token", :unique => true

  create_table "visitors", :force => true do |t|
    t.string   "first_name"
    t.string   "last_name"
    t.string   "personal_number"
    t.string   "rfid_number"
    t.string   "barcode_number"
    t.string   "email"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

end
