#!/usr/bin/python
# -*- coding: utf-8 -*-
#
# LiU card reader
#
# Copyright (c) 2010, Codelead Systems
# All rights reserved.
# 
# Redistribution and use in source and binary forms, with or without
# modification, are permitted provided that the following conditions are met:
#     * Redistributions of source code must retain the above copyright
#       notice, this list of conditions and the following disclaimer.
#     * Redistributions in binary form must reproduce the above copyright
#       notice, this list of conditions and the following disclaimer in the
#       documentation and/or other materials provided with the distribution.
#     * Neither the name Codelead Systems nor the
#       names of its contributors may be used to endorse or promote products
#       derived from this software without specific prior written permission.
# 
# THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND
# ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
# WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
# DISCLAIMED. IN NO EVENT SHALL CODELEAD SYSTEMS BE LIABLE FOR ANY
# DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
# (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
# LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND
# ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
# (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
# SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.

from Xlib.ext.xtest import fake_input
from Xlib.XK import string_to_keysym
from Xlib.X import KeyPress, KeyRelease

from smartcard.CardMonitoring import *
from smartcard.util import toHexString

from gui import *

import Xlib.display

import sys
import traceback
import signal
import os
import threading

class LiUCardObserver (CardObserver):

  def __init__ (self, display, interface):
    self.display = display
    self.interface = interface
    self.cards = {}

    # LiU card
    self.cards["3B 8F 80 01 80 4F 0C A0 00 00 03 06 03 FF 88 00 00 00 00 1C"] = "LiU card"
    self.cards["3B 8F 80 01 80 4F 0C A0 00 00 03 06 03 00 01 00 00 00 00 6A"] = "LiU card"


  def press (self, char):
    keysym = string_to_keysym (char)

    # Assume that all non-alphanumerical characters are spaces
    if keysym == 0:
      keysym = string_to_keysym ("space")

    keycode = display.keysym_to_keycode (keysym)
    fake_input (self.display, KeyPress, keycode)
    fake_input (self.display, KeyRelease, keycode)

  def new_card (self, card):

    atr = toHexString (card.atr)

    if atr not in self.cards:
      self.interface.error ("Detected unknown card.\n\nATR: " + atr)
      return

    print "Detected", self.cards[atr]

    # Read first memory cell
    conn = card.createConnection()
    conn.connect()
    res, sw1, sw2 = conn.transmit ([0xFF, 0xCA, 0x00, 0x00 ,0x00])
    conn.disconnect()

    if sw1 != 0x90:
      self.interface.error ("Invalid response from card, try again")
      return

    if sw2 != 0x00:
      self.interface.error ("Invalid response from card, try again")
      return

    # Transform to LinTek ID
    idnum = 0
    for i in range (len (res)):
      idnum += res[i] << (i * 8)

    for char in str (idnum):
      self.press (char)

    self.press ("Return")
    self.display.sync()

  def update (self, observable, (added, removed)):
    for card in added:
      self.new_card (card)

def sigint (signum, frame):
  print "Interrupted, closing .."
  close_cond.acquire()
  close_cond.notify()
  close_cond.release()

try:

  # Bug in python-xlib causes a bit anoying output from this call
  stdout = sys.stdout
  sys.stdout = open (os.devnull, 'w')
  display = Xlib.display.Display()
  sys.stdout = stdout

  print "Starting LiU card monitor ...",
  monitor = CardMonitor()
 
  if not display.query_extension ("XTEST"):
    print "Failure"
    raise Exception ("Your X display does not support the XTest extension")

  close_cond = threading.Condition()
  gui = LiUInterface (close_cond)

  observer = LiUCardObserver (display, gui)
  monitor.addObserver (observer)

  print "Done"

  # This is not really needed since we support hot-plugging of readers.
  # It's quite nice to know that the reader was detected though.

  print "Readers detected:"
  for reader in readers():
    print " * ", reader

  gui.start()

  signal.signal (signal.SIGINT, sigint)

  close_cond.acquire()
  # A bug in Python requires a timeout to not block signals
  close_cond.wait( 3600 * 24 * 7 * 365 * 100 )
  close_cond.release()

  print "Cleaning up"
  monitor.deleteObserver (observer)

except:
  traceback.print_exc (file=sys.stderr)


