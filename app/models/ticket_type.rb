class TicketType < ActiveRecord::Base
  belongs_to :event
  has_many :tickets
  
  validates_presence_of :event, :on => :create, :message => "can't be blank"
  validates_associated :event, :on => :create
  
  # FIXME Could probably be improved
  before_destroy { |t| raise "Not safe for deletion!" unless t.safe_for_deletion? }
  
  def safe_for_deletion?
    self.tickets.empty?
  end
  
  def to_s
    self.name
  end
end
