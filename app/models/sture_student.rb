# -*- encoding : utf-8 -*-
class StureStudent < ActiveRecord::Base
  scope :search, lambda { |keyword|
    # Convert to string
    keyword = keyword.to_s

    # Searchable keys
    # These keys should have an index in the database for performance
    keys = [:personal_number]

    if not keyword.to_s.strip.empty?
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

  def union_member?
    self.union
  end

  def to_s
    self.personal_number
  end

  # FIXME should rename in database
  def union
    self.student_union
  end

  # Compatible with StudentKoll (Oracle)
  def pnr_format
    self.personal_number
  end
end
