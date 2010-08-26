# Dumpa Ladok
File.open('ladokdump', 'w') do |f|
  Liukort.find(:all).each{ |l| f.write(l.attributes.to_yaml) }
end

# Ladda Ladok

# Konvertera till UTF-8
for f in *.csv; do iconv -f  ISO-8859-1 -t utf-8 "$f" >"$f.utf8.csv"; done

# Ladda CSV-filer
e = Event.first; Dir["/Users/jage/Downloads/CSV/*.csv"].each {|f| e.registration_batches << RegistrationBatch.new(:note => File.basename(f), :data => File.read(f)) }

9528