require 'haml'
require 'mongo'

class MainController
  def self.call(env)
    file = File.read('./views/index.haml')
    template = Haml::Engine.new(file).render
    Rack::Response.new(template)
  end
end

class App
  def incoming(message, callback)
    p "IN #{message}"
    save_message(message) if message['channel'] == '/chat'
    callback.call(message)
  end

  def outgoing(message, callback)
    p "OUT #{message}"
    callback.call(message)
  end

  private

  def db_client
    @db_client ||= Mongo::Client.new(['127.0.0.1:27017'], database: 'chat')
  end

  def save_message(message)
    collection = db_client[:chat]
    doc = { chanel: 'main', message: message['data']['message'], user: message['data']['username'], date: DateTime.now }
    collection.insert_one(doc)
  end
end
