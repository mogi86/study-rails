# Pin npm packages by running ./bin/importmap

pin "application"
pin "@hotwired/turbo-rails", to: "turbo.min.js"
pin "@hotwired/stimulus", to: "stimulus.min.js"
pin "@hotwired/stimulus-loading", to: "stimulus-loading.js"
pin_all_from "app/javascript/controllers", under: "controllers"

# React packages
pin "react", to: "https://esm.sh/react@18.2.0"
pin "react-dom", to: "https://esm.sh/react-dom@18.2.0"
pin "react-dom/client", to: "https://esm.sh/react-dom@18.2.0/client"

# React app entry point
pin "react_app"
