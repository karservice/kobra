class Event < ActiveRecord::Base
  has_many :registrations
  has_many :visitors, :through => :registrations
  has_many :registration_batches
  
  def to_s
    self.title
  end
end
