# -*- encoding : utf-8 -*-
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

# Lägga in sture databas
sture_students = []
File.read("/Users/jage/Desktop/medlem_20100922.txt").each_line {|l| m = /(\d{2})(\d{6})(\w{4}) \| (\w*)/.match(l); sture_students << [ "#{m[2]}-#{m[3]}", m[4] ] }.nil?
sture_students.each {|s|
  unless StureStudent.where(:personal_number => s[0]).first
    StureStudent.create(:personal_number => s[0], :student_union => s[1])
  end
}

new_students.each {|s|
  StureStudent.create(:personal_number => s.pnr_format, :student_union => "LinTek")
}

sture_students_18 = []
File.read("/tmp/medlem_20100918.txt").each_line {|l| m = /(\d{2})(\d{6})(\w{4}) \| (\w*)/.match(l); sture_students_18 << [ "#{m[2]}-#{m[3]}", m[4] ] }.nil?

sture_students_17 = []
File.read("/tmp/medlem_20100917.txt").each_line {|l| m = /(\d{2})(\d{6})(\w{4}) \| (\w*)/.match(l); sture_students_17 << [ "#{m[2]}-#{m[3]}", m[4] ] }.nil?

sture_diff = sture_students_18 - sture_students_17


sture_diff.each {|sd|
  print sd[0]
  print "\t"
  print sd[1]
  print "\t"
  od = Studentkoll.where(:pnr_format => sd).first
  if od
    if od.kar
      print od.kar
    else
      print "-"
    end
    "\t"
    print od.epost
  else
    print "-"
    "#\t"
    print "-"
  end
  print "\n"
}

# Kårer
Consensus = ["At  ",
 "BMA ",
 "Cons",
 "Domf",
 "Fri ",
 "Log ",
 "Läk ",
 "MedB",
 "SG  ",
 "SskL",
 "SskN",
 "Stöd"]

LinTek = ["C   ",
 "CTD ",
 "D   ",
 "DokL",
 "ED  ",
 "FriL",
 "GDK ",
 "I   ",
 "KTS ",
 "Ling",
 "LinT",
 "M   ",
 "MatN",
 "MT  ",
 "N   ",
 "StöL",
 "TBI ",
 "Y   ",

StuFF = ["AJF ",
 "Dokt",
 "flin",
 "FriS",
 "Gans",
 "KogV",
 "MiP ",
 "PULS",
 "SAKS",
 "SKA ",
 "SKUM",
 "Soci",
 "SSHF",
 "Stal",
 "STiL",
 "Stim",
 "StuF"]


# Hur många av varje sektionssträng finns det?
Studentkoll.select(:kar).group_by(&:kar).collect {|k| {k[0] => k[1].size} }

# Hur många saknar kår?
Studentkoll.where(:kar => nil).count
