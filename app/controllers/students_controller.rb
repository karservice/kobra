# -*- encoding : utf-8 -*-
class StudentsController < ApplicationController
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
        @registration  = @event.register_student(@student, self.available_ticket_types)
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
end
