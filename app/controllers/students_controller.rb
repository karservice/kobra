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
    # FIXME Should check Sture
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
        @registration  = @event.register_student(@student, @event.available_ticket_types, current_user)
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

  def api
    if params[:liu_id]
      @student = Student.where(:email => "#{params[:liu_id]}@student.liu.se").first
    elsif params[:email]
      @student = Student.where(:email => params[:email]).first
    elsif params[:rfid_number]
      @student = Student.where(:rfid_number => params[:rfid_number]).first
    elsif params[:barcode_number]
      @student = Student.where(:barcode_number => params[:barcode_number]).first
    elsif params[:personal_number]
      @student = Student.where(:personal_number => params[:personal_number]).first
    end

    if @student
      respond_to do |format|
        format.json { render :json => @student.to_json }
        format.xml  { render :xml => @student.to_xml }
      end
    else
      render :text => nil, :status => 404
    end
  end

private
  def verify_api_key
    authenticate_or_request_with_http_basic do |id, api_key|
      User.verify_api_key(id, api_key)
    end
  end
end
