class Event < ActiveRecord::Base
  has_many :registrations
  has_many :visitors, :through => :registrations
  has_many :registration_batches
  has_many :ticket_types
  has_many :tickets, :through => :registrations
  
  def to_s
    self.title
  end
  
end
