class CreateStureStudents < ActiveRecord::Migration
  def self.up
    create_table :sture_students do |t|
      t.string :personal_number
      t.string :student_union
      
      t.timestamps
    end
  end

  def self.down
    drop_table :sture_students
  end
end
