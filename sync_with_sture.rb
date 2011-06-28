Ticket.find_each(:include => :visitor) do |ticket|
  personal_number = ticket.visitor.personal_number

  if m = personal_number.match(/^(\d{6})-(\w{4})$/)
    personal_number = "19#{m[1]}#{m[2]}"
  end

  # Sync tickets with union
  query = "SELECT k.mainunioncode, m.startdate FROM mp_membershipdata AS m,
    mp_kar_sektions_data AS k WHERE personno ='#{personal_number}' AND
    m.sunionsemesterid = k.id AND k.semester = '#{Time.now.liu_term}' LIMIT 1;"

  result  = Sture.connection.execute(query)

  if result.result_status == PGresult::PGRES_TUPLES_OK && result.ntuples == 1
    start_date = Time.parse(result[0]['startdate'])
    union      = result[0]['mainunioncode']

    if ticket.created_at > start_date
      ticket.update_attribute(:union_discount, union)
    end
  end
end