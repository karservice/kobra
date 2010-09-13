class Liukort < ActiveRecord::Base
  set_table_name "SEKTIONSKOLL"
  establish_connection :sektionskoll
  
  def self.check_rfid_number(rfid_number)
    answer = self.connection.raw_connection.exec("SELECT NVL(MAX(svar), 'N') FROM sektionskoll WHERE tradlosnr=#{rfid_number}").fetch
    answer.first == "Y"      
  end
end