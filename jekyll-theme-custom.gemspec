# frozen_string_literal: true

Gem::Specification.new do |s|
  s.name          = "jekyll-theme-custom"
  s.version       = "0.5.0"
  s.license       = "CC0-1.0"
  s.authors       = ["Nathan R", "rickey.io"]
  s.email         = ["hi@rickey.io"]
  s.homepage      = "https://gpt.rickey.io"
  s.summary       = "Conveniently publish markdown and other content types using GitHub Pages!"

  s.files         = `git ls-files -z`.split("\x0").select do |f|
    f.match(%r{^((_includes|_layouts|_sass|assets)/|(LICENSE|README)((\.(txt|md|markdown)|$)))}i)
  end

  #s.metadata["plugin_type"] = "theme"

  s.required_ruby_version = ">= 2.4.0"

  s.platform = Gem::Platform::RUBY
  s.add_runtime_dependency "jekyll", "> 3.6", "< 5.0"
  s.add_runtime_dependency "jekyll-seo-tag", "~> 2.0"
  s.add_runtime_dependency "jekyll-paginate", "~> 1.1"
  s.add_runtime_dependency "jekyll-sitemap", "~> 1.0"
  s.add_runtime_dependency "jekyll-feed", "~> 0.15"
  s.add_runtime_dependency "jemoji", "~> 0.8"

  s.add_development_dependency "bundler"
  s.add_development_dependency "rake", "~> 10.0"
  s.add_development_dependency "html-proofer", "~> 4.0"
  s.add_development_dependency "rubocop-github", "~> 0.16"
  s.add_development_dependency "w3c_validators", "~> 1.3"
end
