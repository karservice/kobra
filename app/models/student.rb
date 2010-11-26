module StudentMapper
  extend ActiveSupport::Concern
  include ActiveModel::AttributeMethods
  include ActiveModel::Serialization
  include ActiveModel::Serializers::Xml

  included do
    attribute_method_suffix('', '=', '?')
  end

  module ClassMethods
    def attributes
      @attributes ||= Set.new
    end

    def attribute(name)
      attributes << name.to_s
    end
  end

  module InstanceMethods
    def attribute(key)
      instance_variable_get("@#{key}")
    end

    def attribute=(key, value)
      instance_variable_set("@#{key}", value)
    end

    def attribute?(key)
      instance_variable_get("@#{key}").present?
    end

    def attributes
      self.class.attributes
    end
  end
end

# Proxy model to both Sture and Studentkoll
class Student
  include StudentMapper

  STUDENTKOLL_ATTRIBUTES = {
    :personal_number => :pnr_format,
    :email           => :epost,
    :first_name      => :fornamn,
    :last_name       => :efternamn,
    :rfid_number     => :rfidnr,
    :barcode_number  => :streckkodnr,
    :blocked         => :blockerat
  }

  # All the attributes from Studentkoll
  STUDENTKOLL_ATTRIBUTES.each_key do |key|
    attribute key
  end

  # Union from Sture
  attribute :union

  # Simple where conditions
  def self.where(conditions)
    results = []
    conditions.each_pair do |key, value|
      if real_key = STUDENTKOLL_ATTRIBUTES[key]
        results += (Studentkoll.where(real_key => value).all)
      end
    end

    # Transform to Student objects
    results.collect {|s| self.transform(s) }
  end

  def self.model_name
    ActiveModel::Name.new(self)
  end

  private

  def self.transform(object)
    new_student = self.new

    # Map over the Studentkoll attributes
    object.attributes.each_pair do |real_key, value|
      if key = STUDENTKOLL_ATTRIBUTES.invert[real_key.to_sym]
        new_student.__send__(:attribute=,key, value)
      end
    end

    # Get the union from Sture
    new_student.__send__(:attribute=, :union, Sture.union_for(new_student.personal_number))

    # Return the object
    new_student
  end

end