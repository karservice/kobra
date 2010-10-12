# -*- encoding : utf-8 -*-
class EventsController < ApplicationController
  before_filter :require_admin, :only => [:new, :create, :edit, :update]
  before_filter :preload_event, :except => [:index, :new, :create]

  # GET /events
  # GET /events.xml
  def index
    # FIXME Should be handled in the model
    if current_user.admin?
      @events = Event.all
    else
      @events = current_user.events.all
    end

    respond_to do |format|
      format.html # index.html.erb
      format.xml  { render :xml => @events }
    end
  end

  # GET /events/1
  # GET /events/1.xml
  def show
    respond_to do |format|
      format.html # show.html.erb
      format.xml  { render :xml => @event }
    end
  end

  # GET /events/new
  # GET /events/new.xml
  def new
    @event = Event.new

    respond_to do |format|
      format.html # new.html.erb
      format.xml  { render :xml => @event }
    end
  end

  # GET /events/1/edit
  def edit
  end

  # POST /events
  # POST /events.xml
  def create
    @event = Event.new(params[:event])

    respond_to do |format|
      if @event.save
        format.html { redirect_to(@event, :notice => 'Event was successfully created.') }
        format.xml  { render :xml => @event, :status => :created, :location => @event }
      else
        format.html { render :action => "new" }
        format.xml  { render :xml => @event.errors, :status => :unprocessable_entity }
      end
    end
  end

  # PUT /events/1
  # PUT /events/1.xml
  def update
    respond_to do |format|
      if @event.update_attributes(params[:event])
        format.html { redirect_to(@event, :notice => 'Event was successfully updated.') }
        format.xml  { head :ok }
      else
        format.html { render :action => "edit" }
        format.xml  { render :xml => @event.errors, :status => :unprocessable_entity }
      end
    end
  end

  def sale
    @visitor = Visitor.new
  end

  def handout
  end

  def statistics
    @ticket_types = @event.ticket_types
    @ticket_dates = @event.tickets.select(:created_at).group("DATE(created_at)")
    @union_stats  = @event.tickets.select(:union_discount).group_by(&:union_discount).select {|u| !u.nil?}.collect {|u| [u[0], u[1].size] }
  end
private
  # Preload event, admin gets all events
  def preload_event
    if current_user.admin?
      @event = Event.find(params[:id])
    else
      @event = current_user.events.find(params[:id])
    end
  end
end
