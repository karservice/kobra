# -*- encoding : utf-8 -*-
class EventsController < ApplicationController
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
    # Add the user creating this event
    @event.users << current_user

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

    # @dates  = @event.tickets.group("DATE(tickets.created_at)").size
    # @tickets_per_date = @dates.collect do |d|
    #   { d[0] =>
    #     @event.tickets.select(:union_discount).
    #     group(:union_discount).
    #     where("DATE(tickets.created_at) LIKE :date", :date => d[0]).size
    #   }
    # end





    @ticket_types = @event.ticket_types
    @ticket_dates = @event.tickets.select(:created_at).group("DATE(created_at)")
    @union_stats  = @event.tickets.select(:union_discount).group_by(&:union_discount).select {|u| !u.nil?}.collect {|u| [u[0], u[1].size] }
  end

  # FIXME error handling
  def add_user
    @user = User.find(params[:user][:id])
    @event.users << @user
  end

  # FIXME error handling
  def remove_user
    @user = @event.users.find(params[:user][:id])
    # Only remove if not myself, or if admin
    if @user != current_user || current_user.admin?
      @event.users.delete(@user)
    end
  end
private
  # Preload event, admin gets all events
  def preload_event
    @event = Event.find(params[:id])
  end
end
