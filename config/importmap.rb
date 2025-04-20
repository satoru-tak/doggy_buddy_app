# Pin npm packages by running ./bin/importmap

pin "application"
pin "@hotwired/turbo-rails", to: "turbo.min.js"
pin "@hotwired/stimulus", to: "stimulus.min.js"
pin "@hotwired/stimulus-loading", to: "stimulus-loading.js"
pin_all_from "app/javascript/controllers", under: "controllers"
pin "sortablejs" # @1.15.6
pin "animejs" # @3.2.2
pin "imask" # @7.6.1
pin "lodash-es" # @4.17.21
pin "toastify-js" # @1.12.0
