class RegistrationBatch < ActiveRecord::Base
  require 'csv'
  
  belongs_to :event
  has_many :registrations, :dependent => :destroy
  has_many :visitors, :through => :registrations
  
  validates_presence_of :data, :on => :create, :message => "can't be blank"
  validates_length_of :data, :minimum => 10, :on => :create, :message => "must be present"
  
  after_create :start_delayed_import
  
  # FIXME Could probably be improved
  before_destroy { |b| raise "Not safe for deletion!" unless b.safe_for_deletion? }
  
  validate :safe_for_deletion, :on => :destroy
  
  def start_delayed_import
    self.delay.import
  end
  
  def import
    raise "Already imported" if self.imported?
    
    # Parse CSV data and flatten rows
    CSV.parse(self.data).flatten.each do |personal_number|
      Registration.create(
        :event => self.event,
        :registration_batch => self,
        :visitor => Visitor.new(:personal_number => personal_number) # FIXME should look for existing visitors also
      )
    end
    self.update_attribute(:imported_at, Time.now)
    # Start background job to sync these visitors from student database
    self.visitors.delay.sync_from_students
  end
  
  def imported?
    self.imported_at
  end
  
  def safe_for_deletion?
    self.imported? && self.registrations.empty?
  end
end
