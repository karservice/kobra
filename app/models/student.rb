class Student < ActiveRecord::Base
  # Should not return a union if membership has expired

  def self.import_from_studentkoll
    Studentkoll.find_by_sql('SELECT "STUDENTKOLL".* FROM "STUDENTKOLL"') do |s|
      self.create!(:email => s.epost,
                  :first_name => s.fornamn,
                  :last_name => s.efternamn,
                  :personal_number => s.pnr_format,
                  :rfid_number => s.rfidnr,
                  :barcode_number => s.streckkodnr,
                  :expire_at => s.giltig_till,
                  :blocked => s.blockerat)
    end
  end
end