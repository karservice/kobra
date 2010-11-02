# -*- encoding : utf-8 -*-
class StudentsController < ApplicationController

  skip_before_filter :authenticate_user!, :only => :api
  skip_before_filter :verify_authenticity_token, :only => :api
  before_filter :verify_api_key, :only => :api

  def search
    @event    = Event.find(params[:event_id], :include => :ticket_types)
    @students = Studentkoll.search(params[:student][:query])
    @students_count = @students.count

    # Check in StureStudent if Studentkoll couldn't be found
    if @students_count == 0
      @students = StureStudent.search(params[:student][:query])
      @students_count = @students.count
    end

    if @students_count == 1
      @student = @students.first

      if @student.union_member?
        @message = "#{@student} är medlem i #{@student.union}"
      else
        @message = "#{@student} är inte kårmedlem"
      end

      # Should we autosave the student?
      if @event.autosave?
        @registration  = @event.register_student(@student, @event.available_ticket_types)
        @visitor = @registration.visitor
        @message += ' och har registrerats'
      end
    end
  rescue ActiveRecord::RecordInvalid => e
    errors = e.record.errors

    @message  = "Kunde registrera på grund av: "
    @message += errors.keys.collect {|k| errors[k] }.flatten.collect {|k| k.capitalize }.join(', ')
  ensure
    # If we're using autosave, render tickets/sale right away
    if @event.autosave?
      render 'tickets/sale'
    end
  end

  def search_card
    @event = Event.find(params[:event_id], :include => :ticket_types)
    @student = Studentkoll.where(:rfidnr => params[:student][:atr]).first
  end

  # FIXME Should be a better name
  # FIXME Should return better codes if student is found but not a union
  # FIXME Documentation
  #
  #
  #
  def api
    if params[:liu_id]
      epost = "#{params[:liu_id]}@student.liu.se"
      student = Studentkoll.where(:epost => epost).first
      if student
        render :text => student.union.to_s
      else
        render :text => "Not found", :status => 404
      end
    else
      render :text => "No parameter", :status => 400
    end
  end

private
  def verify_api_key
    authenticate_or_request_with_http_basic do |id, password|
      # FIXME Hardcoded hack!
      id == 'klimatveckan' && password == 'lintek'
    end
  end
end
