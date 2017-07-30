require 'bundler'
require './lib/app'
require 'faye'

Bundler.require

use Rack::Static, urls: ['/stylesheets'], root: 'public'
use Faye::RackAdapter, mount: '/faye' do |adapter|
  adapter.add_extension(App.new)
end

Faye::WebSocket.load_adapter('thin')
run MainController
