class RegistrationBatchesController < ApplicationController  
  def index
    @event = Event.find(params[:event_id])
    @registration_batches = @event.registration_batches
  end
  
  def show
    @event = Event.find(params[:event_id])
    @registration_batch = @event.registration_batches.find(params[:id])
    @visitors = @registration_batch.visitors
  end
  
  def new
    @event = Event.find(params[:event_id])
    @registration_batch = RegistrationBatch.new
  end
  
  def create
    @event = Event.find(params[:event_id])
    @event.registration_batches << RegistrationBatch.new(params[:registration_batch])
    redirect_to(event_registration_batches_path(@event))
  end
  
  def destroy
    @event = Event.find(params[:event_id])
    @registration_batch = @event.registration_batches.find(params[:id])
    @registration_batch.destroy
    redirect_to(event_registration_batches_path(@event), :notice => "Batch raderad")
  end
end