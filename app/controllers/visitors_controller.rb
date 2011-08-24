# -*- encoding : utf-8 -*-
class VisitorsController < ApplicationController

  before_filter :load_event

  def index
    @registration_batch = @event.registration_batches.find(params[:registration_batch_id])
    @visitors = @registration_batch.visitors
  end

  def show
    @registration_batch = @event.registration_batches.find(params[:registration_batch_id])
    @visitor = @event.visitors.find(params[:id])
  end

  def search
    @visitors = @event.visitors.search(params[:visitor][:query])
  end

  def reload_from_liu
    @registration_batch = @event.registration_batches.find(params[:registration_batch_id])
    @visitor = Visitor.find(params[:visitor_id])
    @visitor.sync_student
    redirect_to([@event, @registration_batch, @visitor], :notice => 'Uppdaterad från LiU-databasen.')
  end

  # Create Visitor with Ticket
  def create
    # FIXME Should be handled as a transaction?
    @visitor = Visitor.create(params[:visitor])
    @registration = Registration.create(:event => @event, :visitor => @visitor)
    @ticket = Ticket.create(:registration => @registration, :ticket_type => TicketType.find(params[:ticket_type][:id]))
  end

  def edit
    @registration_batch = @event.registration_batches.find(params[:registration_batch_id])
    @visitor = Visitor.find(params[:id])
  end

  def update
    @visitor = Visitor.find(params[:id])
    @registration_batch = @event.registration_batches.find(params[:registration_batch_id])

    respond_to do |format|
      if @visitor.update_attributes(params[:visitor])
        format.html { redirect_to([@event, @registration_batch, @visitor], :notice => 'Uppdaterad.') }
        format.xml  { head :ok }
      else
        format.html { render :action => "edit" }
        format.xml  { render :xml => @visitor.errors, :status => :unprocessable_entity }
      end
    end
  end

private
  def load_event
    @event = Event.find(params[:event_id])
  end
end
