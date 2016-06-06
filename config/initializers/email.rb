# config/initializers/setup_mail.rb

ActionMailer::Base.smtp_settings = {
	:address => Rails.application.secrets.smtp_settings['address'],
	:port => Rails.application.secrets.smtp_settings['port'],
	:domain => Rails.application.secrets.smtp_settings['domain'],
	:user_name => Rails.application.secrets.smtp_settings['user_name'],
	:password => Rails.application.secrets.smtp_settings['password'],
	:authentication => Rails.application.secrets.smtp_settings['authentication'],
	:enable_starttls_auto => Rails.application.secrets.smtp_settings['enable_starttls_auto']
}

ActionMailer::Base.default_url_options[:host] = Rails.application.secrets.smtp_settings['return_path']

# This is for sendgrid: it helps with the statistics on the sendgrid site.
if Rails.application.secrets.smtp_settings['xsmtpapi'].present?
	ActionMailer::Base.default "X-SMTPAPI" => "{\"category\": \"#{Rails.application.secrets.smtp_settings['xsmtpapi']}\"}"
end

if !Rails.application.secrets.mail_intercept['deliver_email']
	ActionMailer::Base.register_interceptor(StagingMailInterceptor)
end
