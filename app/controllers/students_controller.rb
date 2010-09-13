class StudentsController < ApplicationController
  def search
    @event    = Event.find(params[:event_id])
    @students = Student.search(params[:student][:query])
    if @students.size == 1
      @student = @students.first
      @student_is_union_member = Liukort.check_rfid_number(@student.rfid_number)
      
      unless @event.visitors.where(:personal_number => @student.personal_number).empty?
        @notice = 'Redan registrerad'
      else
        # FIXME Should be handled as a transaction?
        @visitor = Visitor.create(:personal_number => @student.personal_number)
        @registration = Registration.create(:event => @event, :visitor => @visitor)
        @ticket = Ticket.create(:registration => @registration, :ticket_type => TicketType.first)
        @tickets_count = @event.tickets.count
        
        @notice = "Biljett registrerad, nummer #{@tickets_count}"
      end

    end
  end
end