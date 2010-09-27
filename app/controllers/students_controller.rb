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

      if @event.ticket_types.size == 1 && @event.ticket_types.first.always_save?
        # FIXME Should be handled as a transaction?
        # FIXME Should be handled in a model?
        @visitor = Visitor.create(:personal_number => @student.pnr_format,
          :first_name => @student.fornamn,
          :last_name => @student.efternamn)
        @registration = Registration.create(:event => @event, :visitor => @visitor)
        Ticket.create(:registration => @registration, :ticket_type => @event.ticket_types.first)
      end
    end
  end
end
