# -*- encoding : utf-8 -*-
class Liukort < ActiveRecord::Base
  set_table_name "SEKTIONSKOLL"
  establish_connection :sektionskoll
  
  # Check the SEKTIONSKOLL Oracle view to see if a user is a LinTek member
  # 
  # The database query is currently broken, since the view isn't up to date with the section <-> union mapping
  # Urban Svensson at LiU-IT is responsible for the database view
  def self.check_rfid_number(rfid_number)
    answer = self.connection.raw_connection.exec("SELECT NVL(MAX(svar), 'N') FROM sektionskoll WHERE tradlosnr=#{rfid_number}").fetch
    answer.first == "Y"      
  end
end
