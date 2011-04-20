# -*- encoding : utf-8 -*-
#
# Mapping to LiUs Oracle cluster, contains a register over
# all students on LiU.
#
# WARNING; Contains a field "kar" which could be used to match
# studient union, but isn't reliable. Use Sture instead.
class Studentkoll < ActiveRecord::Base
  begin
    # Try to use Oracle STUDENTKOLL
    set_table_name "STUDENTKOLL"
    establish_connection :sektionskoll
  rescue ActiveRecord::AdapterNotSpecified
    # If not specified, fall back on standard database
    set_table_name "studentkoll"
  end

  # We prefer english names for attributes
  # Watch out when using the attributes in queries though, only the real field names works then
  alias_attribute :personal_number, :pnr_format
  alias_attribute :email, :epost
  alias_attribute :first_name, :fornamn
  alias_attribute :last_name, :efternamn
  alias_attribute :rfid_number, :rfidnr
  alias_attribute :barcode_number, :streckkodnr

  scope :search, lambda { |keyword|
    # Convert to string
    keyword = keyword.to_s.strip

    # Searchable keys
    # These keys should have an index in the database for performance
    keys = [:epost, :fornamn, :efternamn, :pnr_format, :rfidnr, :streckkodnr]

    unless keyword.empty?
      # FIXME Extract personal number handling to own class, used everywere now
      # Handle different personal number styles
      #  19860421-0000
      #  860421-0000 (don't do anything, just notice)
      # Don't handle numbers without hyphen, don't want to screw with RFID or barcode numbers
      #
      # Personal number recors stored as 860421-0000 in student database
      #
      # Remember foreign exchange students!
      if p = keyword.match(/^(\d{2})(\d{6}-\w{4})$/) # 19860421-0000
        keyword = p[2]
      elsif p = keyword.match(/^(\d{6}-\w{4})$/) # 860421-0000
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

  def liu_id
    self.epost.split('@').first
  end

  def union_member?
    union
  end

  # Returns the union for the student
  def union
    # Ask Sture for the union
    @union ||= Sture.union_for(self)
  end

  # Unions at LiU
  def self.unions
    %w(LinTek Consensus StuFF)
  end
end
