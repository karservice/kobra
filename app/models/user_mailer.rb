class UserMailer < Devise::Mailer
  def welcome_instructions(record)
    setup_mail(record, :welcome_instructions)
  end
end