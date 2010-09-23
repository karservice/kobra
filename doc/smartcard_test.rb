# -*- encoding : utf-8 -*-
require 'rubygems'
require 'smartcard'



def get_uid
  while true
    context = Smartcard::PCSC::Context.new
    reader  = context.readers.first
    
    # Connect to the card
    card = Smartcard::PCSC::Card.new(context, reader, :shared, :t1)
    
    data_to_send = [0xFF, 0xCA, 0x00, 0x00, 0x00].map {|b| b.chr }.join('')
    response = card.transmit(data_to_send)
    
    # Reverse, split inte array, unpack values
    response = response.reverse.split('').collect {|b| b.unpack('H*') }.flatten
    
    # Read the response, ignore status bytes
    uid = response[2..-1].join('').to_i(16)
    
    card.disconnect
    
    context.release
    
    puts uid
    uid
    sleep 5
  end
rescue
  sleep 5
  retry
end
