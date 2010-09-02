# Dumpa Ladok
File.open('ladokdump', 'w') do |f|
  Liukort.find(:all).each{ |l| f.write(l.attributes.to_yaml) }
end

# Ladda Ladok

# Konvertera till UTF-8
for f in *.csv; do iconv -f  ISO-8859-1 -t utf-8 "$f" >"$f.utf8.csv"; done

# Ladda CSV-filer
e = Event.first; Dir["/Users/jage/Desktop/CSV_production/*.csv"].each {|f| e.registration_batches << RegistrationBatch.new(:note => File.basename(f), :data => File.read(f)) }

students = []
90.times do |i|
  Liukort.find(:all, :offset => i * 1000, :limit => 1000).each do |l|
    students << l.attributes
  end
end

File.open('ladokdump', 'w') {|fp| fp.write(Marshal.dump(students))}
ladok_students = Marshal.load(File.read('ladokdump'))
ladok_students.each do |ladok_student|
  Student.create({
    :email => ladok_student["epost"],
    :first_name => ladok_student["fornamn"],
    :last_name => ladok_student["efternamn"],
    :personal_number => ladok_student["pnr_format"],
    :rfid_number => ladok_student["rfidnr"],
    :barcode_number => ladok_student["streckkodnr"],
    :expire_at => ladok_student["giltig_till"],
    :blocked => ladok_student["blockerat"]
  })
end

Liukort.find(:all).each do |l|
  students << l.attributes
end

RegistrationBatch.all.each {|r| r.visitors.sync_from_students }

# Räkna biljetter
Ticket.count - Ticket.where(:handed_out_at => nil).count
