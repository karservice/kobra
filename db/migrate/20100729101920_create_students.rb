class CreateStudents < ActiveRecord::Migration
  def self.up
    create_table :students do |t|
      t.string :first_name
      t.string :last_name
      t.string :personal_number
      t.string :rfid_number
      t.string :barcode_number
      t.datetime :expire_at
      t.boolean :blocked
      t.boolean :union_member

      t.timestamps
    end
  end

  def self.down
    drop_table :students
  end
end
