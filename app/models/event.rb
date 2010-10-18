# -*- encoding : utf-8 -*-
class Event < ActiveRecord::Base
  has_many :registrations
  has_many :visitors, :through => :registrations
  has_many :registration_batches
  has_many :ticket_types
  has_many :tickets, :through => :registrations
  has_and_belongs_to_many :users

  validates_presence_of :title, :on => :create, :message => "can't be blank"

  def to_s
    self.title
  end

  def available_ticket_types
    self.ticket_types.select {|t| t.available? }
  end

  def autosave?
    self.ticket_types.size == 1 && self.ticket_types.first.always_save?
  end

  # FIXME Should be handled as a transaction?
  def register_student(student, tickets, union_override = nil)
    # Look if Student already is a Visitor
    visitor = Visitor.where(:personal_number => student.pnr_format).first
    # Unless, create a new Visitor
    visitor ||= Visitor.create(:personal_number => student.pnr_format,
      :first_name => student.fornamn,
      :last_name => student.efternamn)
    registration = Registration.create!(:event => self, :visitor => visitor)
    tickets.each do |ticket|
      # Create the ticket, add union_override if it's available
      # FIXME a bit ugly
      Ticket.create!(:registration => registration, :ticket_type => ticket,
        :union_override => !union_override.nil?, :union_discount => union_override)
    end
    # Return registration
    registration
  end
end
