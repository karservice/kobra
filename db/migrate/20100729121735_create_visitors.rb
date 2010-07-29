class CreateVisitors < ActiveRecord::Migration
  def self.up
    create_table :visitors do |t|
      t.string :first_name
      t.string :last_name
      t.string :personal_number
      t.string :rfid_number
      t.string :barcode_number
      t.string :email

      t.timestamps
    end
  end

  def self.down
    drop_table :visitors
  end
end
