# -*- encoding : utf-8 -*-
class TicketsController < ApplicationController

  before_filter :load_event

  # Hand out a ticket
  def handout
    @ticket = @event.tickets.find(params[:id])
    @ticket.handout!
  end

  # Sales an arbitrary amount of tickets to a Visitor
  #
  # If the personal number is found in a student database, the Visitor
  # gets attributes such as Visitor#first_name, Visitor#last_name and Visitor#union_override
  def sale
    @student = Studentkoll.where(:pnr_format => params[:student][:pnr_format]).first
    if params[:student] && !params[:student][:union].empty?
      @union_override = params[:student][:union]
    end

    ticket_types = []
    params[:ticket_type].each_pair do |ticket_type, state|
      if state == "1"
        ticket_types << TicketType.find(ticket_type)
      end
    end

    @registration = @event.register_student(@student, ticket_types, @union_override)
    @tickets = @registration.tickets

    @tickets_count = @event.tickets.count
  rescue ActiveRecord::RecordInvalid => e
    errors = e.record.errors

    @message  = "Kunde registrera på grund av: "
    @message += errors.keys.collect {|k| errors[k] }.flatten.collect {|k| k.capitalize }.join(', ')
  end
private
  def load_event
    @event = Event.find(params[:event_id])
  end
end
