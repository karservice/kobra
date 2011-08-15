# -*- encoding : utf-8 -*-
class Registration < ActiveRecord::Base
  belongs_to :event
  belongs_to :visitor
  belongs_to :registration_batch
  has_many :tickets, :dependent => :destroy # FIXME registration should never be deleted

  validates_presence_of :event, :on => :create, :message => "can't be blank"
  validates_presence_of :visitor, :on => :create, :message => "can't be blank"
  validates_associated :event, :on => :create
  validates_associated :visitor, :on => :create

  validate :validate_union_limit, :on => :create

  # Only one ticket per event, unless permanent event
  # Multiple registrations are ok, but only if the registrations has different tickets (ticket types)
  validates_uniqueness_of :visitor_id, :on => :create, :scope => :event_id,
    :unless => Proc.new { |r|
      r.event.permanent? ||
        (r.tickets.collect {|t| t.ticket_type } & r.visitor.tickets.collect {|t| t.ticket_type }).empty?
    },
    :message => "en rabatt per student"


  def validate_union_limit
    self.tickets.each do |ticket|
      if Studentkoll.unions.include?(ticket.ticket_type.available_for_union) && ticket.ticket_type.available_for_union != self.visitor.union
        self.errors.add(:base, "Är inte medlem i #{ticket.ticket_type.available_for_union}")
      end
    end
  end

end
