# -*- encoding : utf-8 -*-
class Visitor < ActiveRecord::Base
  has_many :registrations, :dependent => :destroy # FIXME visitor should never be deleted
  has_many :tickets, :through => :registrations
  has_many :events, :through => :registrations

  scope :search, lambda { |keyword|
      keyword = keyword.to_s.strip

      # Searchable keys
      # These keys should have an index in the database for performance
      keys = [:first_name, :last_name, :personal_number, :rfid_number, :barcode_number, :email]

      unless keyword.empty?
        # Handle different personal number styles
        #  19860421-0000
        #  198604210000
        #  860421-0000 (don't do anything, just notice)
        #  8604210000
        # Records stored as 860421-0000 in student database
        if m = keyword.match(/^(\d{2})(\d{6}-\w{4})$/) # 19860421-0000
          keyword = m[2]
        elsif m = keyword.match(/^(\d{2})(\d{6})(\w{4})$/) # 198604210000
        #  keyword = m[2] + "-" + m[3]
        elsif m = keyword.match(/^(\d{6}-\w{4})$/) # 860421-0000
          # Just notice for later performance tweak
        # FIXME Breaks RFID
        elsif m = keyword.match(/^(\d{6})(\w{4})$/) # 8604210000
        #  keyword = m[1] + "-" + m[2]
        end
        # If there is a match, we can just look at personal_number column to speed things up a bit
        #keys = [:personal_number] if m
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

  attr_accessor :query # For queries

  # Sets attributes from Studentkoll student
  def set_attributes_from_student(student)
    self.first_name     = student.fornamn
    self.last_name      = student.efternamn
    self.rfid_number    = student.rfidnr
    self.barcode_number = student.streckkodnr
    self.email          = student.epost
  end

  # Should be split up in a few delayed jobs for parallelization
  def self.sync_from_students
    # FIXME benchmark and use the best batch_size
    self.find_each(:batch_size => 100) do |visitor|
      visitor.sync_student
    end
  end

  def sync_student
    if student = Studentkoll.where(:pnr_format => self.personal_number).first
      self.set_attributes_from_student(student)
      self.save
    elsif student = Studentkoll.where(:epost => self.email).first
      self.set_attributes_from_student(student)
      self.save
    end
  end

  def name
    "#{self.first_name} #{self.last_name}"
  end

  def to_s
    self.name
  end

  def union_member?
    union
  end

  # Returns the union for the student
  def union
    # Ask Sture for the union
    @union ||= Sture.union_for(self)
  end

  def liu_id
    self.email.split('@').first if self.email
  end

  def underage?
  end
end
