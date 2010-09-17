class TicketsController < ApplicationController  
  
  before_filter :load_event
  
  def handout
    @ticket = @event.tickets.find(params[:id])
    @ticket.handout!
  end
  
  def sale
    @student = Studentkoll.where(:pnr_format => params[:student][:pnr_format]).first
    if params[:student] && !params[:student][:union].empty?
      @union_override = params[:student][:union]
    end
    
    # FIXME Should be handled as a transaction?
    @visitor = Visitor.create(:personal_number => @student.pnr_format,
      :first_name => @student.fornamn,
      :last_name => @student.efternamn,
      :union_override => @union_override)
    @registration = Registration.create(:event => @event, :visitor => @visitor)
    @tickets = []
    params[:ticket_type].each_pair do |ticket_type, state|
      if state == "1"
        @tickets << Ticket.create(:registration => @registration,
          :ticket_type => TicketType.find(ticket_type))
      end
    end
    
    @tickets_count = @event.tickets.count
  end
private
  def load_event
    @event = Event.find(params[:event_id])
  end
end