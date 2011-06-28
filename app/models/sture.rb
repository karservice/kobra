# -*- encoding : utf-8 -*-
#
# There's no real use for ActiveRecord here, so we'll use PG for direct SQL-queries
#
class Sture
  def self.sync_students
    @connection = self.connect

    # Ask for mainunioncode (LinTek, StuFF or Consensus) by checking
    # registered (paid) for the current LiU term (20102 for 2010 autumn)
    query = "SELECT k.mainunioncode AS union, personno AS personal_number
      FROM mp_membershipdata AS m, mp_kar_sektions_data AS k
      WHERE m.sunionsemesterid = k.id AND
      k.semester = '#{Time.now.liu_term}';"

    result = @connection.exec(query)

    # If tuples are ok, return the results
    if result.result_status == PGresult::PGRES_TUPLES_OK
      result.each do |r|
        m = r['personal_number'].match(/\d{2}(\d{6})(\w{4})/)
        personal_number = "#{m[1]-m[2]}"

        Student.where(:personal_number => personal_number).update_attribute(:union, r['union'])
      end
    else
      nil
    end
  ensure
    @connection.finish
  end

  # Get union for Visitor/Student or personal_number
  #
  # Asks STURE the student union register
  # FIXME Should be possible to know if there was a match or not
  def self.union_for(student_or_personal_number)
    @connection = self.connect

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
    # personal number (198604210000) and registered (paid) for the current
    # LiU term (20102 for 2010 autumn)
    query = "SELECT k.mainunioncode FROM mp_membershipdata AS m,
      mp_kar_sektions_data AS k WHERE personno ='#{personal_number}' AND
      m.sunionsemesterid = k.id AND k.semester = '#{Time.now.liu_term}' LIMIT 1;"

    # Ask the PostgreSQL server directly, no use for ActiveRecord here.
    result = @connection.exec(query)

    # If tuples are ok, and we only get one result, return the string
    if result.result_status == PGresult::PGRES_TUPLES_OK && result.ntuples == 1
      result[0]['mainunioncode']
    else
      nil
    end
  ensure
    @connection.finish
  end

  protected

  # Remember to close
  def self.connect
    config = Rails.configuration.database_configuration["sture"]
    PGconn.connect(config["host"], (config["port"]) || 5432, '', '', config["database"], config["username"], config["password"])
  end
end