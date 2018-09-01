FROM jruby:9

WORKDIR /usr/src/app

COPY Gemfile* ./
RUN bundle install
COPY . .

RUN chmod +x ./start.sh

EXPOSE 3000

CMD ["./start.sh"]
