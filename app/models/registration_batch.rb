class RegistrationBatch < ActiveRecord::Base
  require 'csv'
  
  belongs_to :event
  has_many :registrations, :dependent => :destroy
  has_many :visitors, :through => :registrations
  has_many :tickets, :through => :registrations
  
  validates_presence_of :event, :on => :create, :message => "can't be blank"
  validates_associated :event, :on => :create
  validates_presence_of :data, :on => :create, :message => "can't be blank"
  validates_length_of :data, :minimum => 10, :on => :create, :message => "must be present"
  
  after_create :start_delayed_import
  
  # FIXME Could probably be improved
  before_destroy { |b| raise "Not safe for deletion!" unless b.safe_for_deletion? }
  
  attr_accessor :ticket_type # When generating tickets
    
  def start_delayed_import
    #self.delay.import
    self.import
  end
  
  # Parses CSV data, creates:
  # * Visitor with  Visitor#personal_number, Visitor#first_name and Visitor#last_name. 
  # * Registration with Registration#event (Event), Registration#visitor (Visitor) and Registration#registration_batch (RegistrationBatch)
  # 
  # After the CSV data is parsed, it will start syncing the visitors 
  # from the student database, in order to get RFID number etc
  def import
    raise "Already imported" if self.imported?
    
    Registration.transaction do
      # Parse CSV data
      # FIXME Handle nils
      CSV.parse(self.data, :col_sep => ';').each do |row|
        first_name      = row[0]
        last_name       = row[1]
        personal_number = row[2]
        
        visitor = Visitor.where(:personal_number => personal_number).first ||
                  Visitor.new(:personal_number => personal_number,
                              :first_name => first_name, 
                              :last_name => last_name)
        
        Registration.create(
          :event => self.event,
          :visitor => visitor,
          :registration_batch => self
        )
      end
      self.update_attribute(:imported_at, Time.now)
      
      # Start background job to sync these visitors from student database
      self.visitors.sync_from_students
    end
  end
  
  def generate_tickets
    # FIXME benchmark and use the best batch_size
    self.registrations.find_each(:batch_size => 100) do |registration|
      Ticket.create(
        :ticket_type => self.ticket_type,
        :registration => registration
      )
    end
  end
  
  def imported?
    self.imported_at
  end
  
  def safe_for_deletion?
    self.imported? && self.tickets.empty?
  end
  
  def to_s
    self.note
  end
end
