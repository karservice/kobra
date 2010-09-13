class StudentsController < ApplicationController
  def search
    @event    = Event.find(params[:event_id])
    @students = Studentkoll.search(params[:student][:query])
    
    if @students.size == 1
      @student = @students.first
      
      unless @event.visitors.where(:personal_number => @student.pnr_format).empty?
        @notice = 'Redan registrerad'
      end

    end
  end
end
