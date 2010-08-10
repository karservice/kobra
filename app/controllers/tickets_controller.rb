class TicketsController < ApplicationController  
  
  before_filter :load_event
  
  def handout
    @ticket = @event.tickets.find(params[:id])
    @ticket.handout!
  end
private
  def load_event
    @event = Event.find(params[:event_id])
  end
end