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

ActiveRecord::Schema.define(:version => 20101006130758) do

# Could not dump table "admins" because of following NoMethodError
#   undefined method `type' for #<ActiveRecord::ConnectionAdapters::IndexDefinition:0x0000010b00a120>

# Could not dump table "delayed_jobs" because of following NoMethodError
#   undefined method `type' for #<ActiveRecord::ConnectionAdapters::IndexDefinition:0x000001011e4f40>

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

# Could not dump table "students" because of following NoMethodError
#   undefined method `type' for #<ActiveRecord::ConnectionAdapters::IndexDefinition:0x00000103569768>

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
    t.integer  "number_of_lintek_discount_tickets"
    t.integer  "lintek_discount_count"
    t.integer  "lintek_discount"
    t.boolean  "always_save"
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
    t.string   "union_discount"
    t.boolean  "lintek_discount"
    t.boolean  "union_override"
  end

# Could not dump table "users" because of following NoMethodError
#   undefined method `type' for #<ActiveRecord::ConnectionAdapters::IndexDefinition:0x0000010120cf90>

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
