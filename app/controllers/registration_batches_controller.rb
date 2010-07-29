class RegistrationBatchesController < ApplicationController  
  
  before_filter :load_event
  
  def index
    @registration_batches = @event.registration_batches
  end
  
  def show
    @registration_batch = @event.registration_batches.find(params[:id])
    @visitors = @registration_batch.visitors
  end
  
  def new
    @registration_batch = RegistrationBatch.new
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