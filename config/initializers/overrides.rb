# Extend Time, print LiU "terminstid"
#
# Before august (month 8) it's VT, after it's HT
# VT is 1, HT is 2
class Time
  def liu_term
    self.strftime("%Y") + (self.month < 8 ? 1 : 2).to_s
  end
end
