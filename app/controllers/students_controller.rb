class StudentsController < ApplicationController
  def search
    @event    = Event.find(params[:event_id])
    @students = Studentkoll.search(params[:student][:query])
    if @students.size == 1
      @student = @students.first
      @student_is_union_member = @student.kar
      
      unless @event.visitors.where(:personal_number => @student.pnr_format).empty?
        @notice = 'Redan registrerad'
      else
        # FIXME Should be handled as a transaction?
        @visitor = Visitor.create(:personal_number => @student.pnr_format)
        @registration = Registration.create(:event => @event, :visitor => @visitor)
        @ticket = Ticket.create(:registration => @registration, :ticket_type => TicketType.first)
        @tickets_count = @event.tickets.count
        
        #@notice = "Biljett registrerad, nummer #{@tickets_count}"
	@notice = "Biljett registrerad"
      end

    end
  end
end
