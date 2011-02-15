# -*- encoding : utf-8 -*-
class Event < ActiveRecord::Base
  has_many :registrations
  has_many :visitors, :through => :registrations
  has_many :registration_batches
  has_many :ticket_types
  has_many :tickets, :through => :registrations
  has_and_belongs_to_many :users

  validates_presence_of :title, :on => :create, :message => "can't be blank"

  # Latest event first
  default_scope order("created_at DESC")

  def to_s
    self.title
  end

  # FIXME Should probably be a scope
  def available_ticket_types
    self.ticket_types.select {|t| t.available? }
  end

  # FIXME Ugly hack
  def autosave?
    self.available_ticket_types.size == 1 && self.available_ticket_types.first.always_save?
  end

  # FIXME Should be handled as a transaction?
  # FIXME Better parameter handling
  # Student might not be a real student
  # FIXME Could use less code when getting the attributes from student
  def register_student(student, tickets, current_user, union_override = nil)
    # Look if Student already is a Visitor
    visitor = Visitor.where(:personal_number => student.personal_number).first

    # Unless, create a new Visitor
    visitor ||= Visitor.create(:personal_number => student.personal_number,
      :first_name => student.first_name,
      :last_name => student.last_name)
    registration = Registration.new(:event => self, :visitor => visitor)
    registration.tickets = tickets.collect do |ticket_type|
      # Create the ticket, add union_override if it's available
      # FIXME a bit ugly
      Ticket.new(:ticket_type => ticket_type,
        :union_override => !union_override.nil?, :union_discount => union_override, :seller => current_user)
    end

    registration.save!

    # Return registration
    registration
  end
end
