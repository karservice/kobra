class Ticket < ActiveRecord::Base
  belongs_to :ticket_type
  belongs_to :registration
  
  validates_presence_of :ticket_type, :on => :create, :message => "can't be blank"
  validates_presence_of :registration, :on => :create, :message => "can't be blank"
  validates_associated :ticket_type, :on => :create
  validates_associated :registration, :on => :create
  
  validate :validate_maximum_number_of_tickets, :on => :create
  
  def validate_maximum_number_of_tickets
    # maximum_number_of_tickets == 0 means infinit
    if (self.ticket_type.maximum_number_of_tickets.to_i != 0) && (self.ticket_type.tickets.count >= self.ticket_type.maximum_number_of_tickets.to_i)
      self.errors.add(:base, "Biljetter slut") 
    end
  end
  
  def handout!
    self.update_attribute(:handed_out_at, Time.now)
  end
  
  def handed_out?
    self.handed_out_at
  end
  
  def to_s
    self.ticket_type.to_s
  end
end
