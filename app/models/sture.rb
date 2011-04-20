# -*- encoding : utf-8 -*-
class Sture < ActiveRecord::Base
  begin
    establish_connection :sture
  rescue ActiveRecord::AdapterNotSpecified
    # If not specified, fall back on standard database
    set_table_name "sture"
  end

  # Get union for Visitor/Student or personal_number
  #
  # Asks STURE the student union register
  # FIXME Should be possible to know if there was a match or not
  def self.union_for(student_or_personal_number)
    # If it's a Visitor or Student, then use it's personal number
    # Othervise assume it's a personal_number string
    if student_or_personal_number.respond_to?(:personal_number)
      personal_number = student_or_personal_number.personal_number
    else
      personal_number = student_or_personal_number
    end

    # If formated personal number, convert to long string
    # 860421-0000 -> 198604210000
    # Remember foreign exchange students! (\w instead of \d)
    if m = personal_number.match(/^(\d{6})-(\w{4})$/)
      personal_number = "19#{m[1]}#{m[2]}"
    end

    # Ask for mainunioncode (LinTek, StuFF or Consensus) by checking
    # personal number (198604210000) and registered (paid) for the curerent
    # LiU term (20102 for 2010 autumn)
    query = "SELECT k.mainunioncode FROM mp_membershipdata AS m,
      mp_kar_sektions_data AS k WHERE personno ='#{personal_number}' AND
      m.sunionsemesterid = k.id AND k.semester = '#{Time.now.liu_term}' LIMIT 1;"

    # Ask the PostgreSQL server directly, no use for ActiveRecord here.
    result = self.connection.execute(query)

    # If tuples are ok, and we only get one result, return the string
    if result.result_status == PGresult::PGRES_TUPLES_OK && result.ntuples == 1
      result[0]['mainunioncode']
    else
      nil
    end
  end
end