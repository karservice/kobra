class Student < ActiveRecord::Base
  scope :search, lambda { |keyword|
      # Convert to string
      keyword = keyword.to_s
      
      # Searchable keys
      # These keys should have an index in the database for performance
      keys = [:first_name, :last_name, :personal_number, :rfid_number, :barcode_number, :email]
      
      if not keyword.to_s.strip.empty?
        # Handle different personal number styles
        #  19860421-0000
        #  860421-0000 (don't do anything, just notice)
        # Don't handle numbers without hyphen, don't want to screw with RFID or barcode numbers
        #
        # Personal number recors stored as 860421-0000 in student database
        if m = keyword.match(/^(\d{2})(\d{6}-\d{4})$/) # 19860421-0000
          keyword = m[2]
        elsif m = keyword.match(/^(\d{6}-\d{4})$/) # 860421-0000
          # Just notice for later performance tweak
        end
        # If there is a match, we can just look at personal_number column to speed things up a bit
        keys = [:personal_number] if m
        # Create the SQL query
        sql_keys = keys.collect {|k| "LOWER(#{k}) LIKE ?"}.join(' OR ')
        keyword.gsub!('*', '%')
        tokens = keyword.split.collect {|c| "%#{c.downcase}%"}
        condition = [(["(#{sql_keys})"] * tokens.size).join(" AND "),
          *tokens.collect {|t| [t] * keys.length }.flatten]
        {:conditions => condition}
      else
        {:limit => 0}
      end
    }
end
