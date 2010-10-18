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

import gtk
import gtk.gdk
import gobject

import threading
import os
import sys

class LiUInterface (threading.Thread):
 
  def __init__ (self, close_cond):
    threading.Thread.__init__ (self)
    self.close_cond = close_cond
    self.daemon = True
    self.pending_error = False

  def run (self):
    gobject.threads_init()
    icon = LiUTrayIcon()
    gtk.main()
    self.close_cond.acquire()
    self.close_cond.notify()
    self.close_cond.release()

  def close_error (self, dialog, response, *args):
    self.pending_error = False
    dialog.destroy()

  def error (self, message):
    print "Error:", message
    try:

      if not self.pending_error:
        gtk.gdk.threads_enter()
        dialog = gtk.MessageDialog (None, gtk.DIALOG_MODAL, gtk.MESSAGE_ERROR, 
          gtk.BUTTONS_OK, message)

        dialog.connect ("response", self.close_error, dialog)
        self.pending_error = True
        dialog.show()
    finally:
      gtk.gdk.threads_leave()

class LiUTrayIcon:

  def __init__ (self):
    self.menu = gtk.Menu()
    self.menu_exit = gtk.MenuItem ("Exit");
    self.menu_about = gtk.MenuItem ("About");
   
    self.menu_exit.show()
    self.menu_about.show()

    sep = gtk.MenuItem (None)
    sep.show()

    self.menu.append (self.menu_about)
    self.menu.append (sep)
    self.menu.append (self.menu_exit)

    self.menu_about.connect ("activate", self.about, None)
    self.menu_exit.connect ("activate", self.exit, None)

    icon_file = os.path.dirname (sys.argv[0]) + "/rfid.png"
    self.icon = gtk.status_icon_new_from_file (icon_file)
    self.icon.connect ("popup-menu", self.popup, None)

  def about (self, item, param1):
    message = gtk.MessageDialog (None, gtk.DIALOG_MODAL, gtk.MESSAGE_INFO, 
        gtk.BUTTONS_OK, "LiU card reader\n\n"
        "Developed by Codelead Systems for LinTek\n"
        "Copyright 2010, Codelead Systems")

    message.connect ("response", self.close_about, message)
    message.show()

  def close_about (self, dialog, response, *args):
    dialog.destroy()

  def exit (self, item, *args):
    gtk.main_quit()

  def popup (self, icon, button, time, *args):
    self.menu.popup (None, None, 
        gtk.status_icon_position_menu, button, time, self.icon)


