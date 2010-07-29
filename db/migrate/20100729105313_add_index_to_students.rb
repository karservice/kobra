class AddIndexToStudents < ActiveRecord::Migration
  def self.up
    add_index :students, 
      [:first_name, :last_name, :personal_number, :rfid_number, :barcode_number, :email],
      :name => 'search_index',
      :unique => true
  end

  def self.down
    remove_index :students, :name => 'search_index'
  end
end
