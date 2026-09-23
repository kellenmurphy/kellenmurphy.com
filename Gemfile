# frozen_string_literal: true
source "https://rubygems.org"
gemspec

# for design on windows, allows `bundle exec jekyll serve --watch` to auto-reload
platforms :mingw, :x64_mingw, :mswin, :jruby do
    gem "tzinfo", "~> 1.2"
    gem "tzinfo-data"
end

gem "wdm", "~> 0.1.1", :platforms => [:mingw, :x64_mingw, :mswin]
gem "http_parser.rb", "~> 0.6.0", :platforms => [:jruby]
gem "webrick", "~> 1.7"

gem 'bootstrap', '~> 5.3.8'
