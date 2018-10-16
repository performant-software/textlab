FROM jruby:9

EXPOSE 3000

RUN mkdir /app
WORKDIR /app

ADD Gemfile /app/Gemfile
ADD Gemfile.lock /app/Gemfile.lock
RUN gem install bundler
RUN bundle install --without development test

WORKDIR /app
ADD . /app

RUN chmod +x run.sh
ENV RAILS_ENV=production
CMD ["sh", "-c", "./run.sh"]
