# -*- encoding : utf-8 -*-
#
# smartcard 0.5.0
#   csc-lite-1.6.4
#   ccid-1.4.0
# vapir-common 1.7.1
# vapir-firefox 1.7.1
#   Firefox with JSSH


require 'rubygems'
require 'smartcard'
require 'vapir'

# Start a new Firefox window
firefox = Vapir::Firefox.new
firefox.goto("http://localhost/events/4/sale")

context = Smartcard::PCSC::Context.new
reader  = context.readers.first

queries = Smartcard::PCSC::ReaderStateQueries.new(1)
queries[0].reader_name = reader

# Wait for something to happen
while context.wait_for_status_change(queries)
  queries.ack_changes

  # Read UID if card present
  if queries[0].current_state == Set.new([:changed, :present])
    card = Smartcard::PCSC::Card.new(context, reader, :shared, :t1)
    # Send to Firefox
    firefox.execute_script <<-eos
      $('notice').update("Läser kort")
    eos

    # 
    data_to_send = [0xFF, 0xCA, 0x00, 0x00, 0x00].map {|b| b.chr }.join('')
    response = card.transmit(data_to_send)

    # Reverse, split inte array, unpack values
    response = response.reverse.split('').collect {|b| b.unpack('H*') }.flatten

    # Read the response, ignore status bytes
    uid = response[2..-1].join('').to_i(16)

    # Send to Firefox
    firefox.execute_script <<-eos
      if($('student_query')) {
        $('student_query').value = '#{uid}';
        $('student_submit').click();
      }
      $('notice').update("Kort läst")
    eos

    # Disconnect from card
    card.disconnect
  else
    firefox.execute_script <<-eos
      $('notice').update("Väntar på kort")
    eos
  end
end

context.release