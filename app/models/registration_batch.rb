class RegistrationBatch < ActiveRecord::Base
  require 'csv'
  
  belongs_to :event
  has_many :registrations
  
  def import
    raise "Already imported" if self.imported?
    
    # Parse CSV data and flatten rows
    CSV.parse(self.data).flatten.each do |personal_number|
      Registration.create(
        :event => self.event,
        :registration_batch => self,
        :visitor => Visitor.new(:personal_number => personal_number)
      )
    end
    self.update_attribute(:imported_at, Time.now)
  end
  
  def imported?
    self.imported_at
  end
end
