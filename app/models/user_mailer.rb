class UserMailer < Devise::Mailer
  def welcome_instructions(record)
    devise_mail(record, :welcome_instructions)
  end
end