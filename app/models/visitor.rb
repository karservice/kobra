class Visitor < ActiveRecord::Base
  has_many :registrations
  has_many :events, :through => :registrations
    
  # Sets attributes from student
  def set_attributes_from_student(student)
    self_attributes = Visitor.new.attributes.keys
    # Take all attributes that are the same, this requires Ruby 1.9
    student_attributes = student.attributes.select do |k,v|
      self_attributes.include?(k)
    end
    self.attributes = student_attributes
  end
  
  def self.sync_from_students
    self.all.each do |visitor|
      if student = Student.where(:personal_number => visitor.personal_number).first
        visitor.set_attributes_from_student(student)
        visitor.save
      end
    end
  end
end
