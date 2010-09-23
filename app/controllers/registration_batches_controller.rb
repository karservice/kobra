# -*- encoding : utf-8 -*-
class RegistrationBatchesController < ApplicationController  
  
  before_filter :load_event
  
  def index
    @registration_batches = @event.registration_batches
  end
  
  def show
    @registration_batch = @event.registration_batches.find(params[:id])
  end
  
  def data
    @registration_batch = @event.registration_batches.find(params[:id])
  end
  
  def new
    @registration_batch = RegistrationBatch.new
  end
  
  def generate_tickets
    @registration_batch = @event.registration_batches.find(params[:id])
    @registration_batch.ticket_type = TicketType.find(params[:ticket_type][:id])
    # FIXME Ugly as hell
    tickets_before = @registration_batch.tickets.count
    @registration_batch.generate_tickets
    tickets_after = @registration_batch.tickets.count
    if tickets_after > tickets_before
      notice = "Biljetter genererade"
    else
      notice = "Gick ej att generera biljetter"
    end
    
    redirect_to(event_registration_batches_path(@event), :notice => notice)
  end
  
  def create
    @event.registration_batches << RegistrationBatch.new(params[:registration_batch])
    redirect_to(event_registration_batches_path(@event))
  end
  
  def destroy
    @registration_batch = @event.registration_batches.find(params[:id])
    @registration_batch.destroy
    redirect_to(event_registration_batches_path(@event), :notice => "Batch raderad")
  end
private
  def load_event
    @event = Event.find(params[:event_id])
  end
end
