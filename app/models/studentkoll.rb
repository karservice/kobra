class Studentkoll < ActiveRecord::Base
  set_table_name "STUDENTKOLL"
  establish_connection :sektionskoll

    scope :search, lambda { |keyword|
      # Convert to string
      keyword = keyword.to_s
      
      # Searchable keys
      # These keys should have an index in the database for performance
      keys = [:epost, :fornamn, :efternamn, :pnr_format, :rfidnr, :streckkodnr]
      
      if not keyword.to_s.strip.empty?
        # Handle different personal number styles
        #  19860421-0000
        #  860421-0000 (don't do anything, just notice)
        # Don't handle numbers without hyphen, don't want to screw with RFID or barcode numbers
        #
        # Personal number recors stored as 860421-0000 in student database
        if p = keyword.match(/^(\d{2})(\d{6}-\d{4})$/) # 19860421-0000
          keyword = p[2]
        elsif p = keyword.match(/^(\d{6}-\d{4})$/) # 860421-0000
          # Just notice for later performance tweak
        elsif m = keyword.match(/^0(\d{9})$/)
          # Look if number is a RFID number with an extra zero
          keyword = m[1]
        end
        # If there is a match, we can just look at personal_number column to speed things up a bit
        keys = [:pnr_format] if p
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


    def name
      "#{self.fornamn} #{self.efternamn}"
    end

    def to_s
      self.name
    end
    
    def union_member?
      union
    end
    
    def union
      if result = StureStudent.where(:personal_number => self.pnr_format).first
        result.student_union
      end
    end
end
