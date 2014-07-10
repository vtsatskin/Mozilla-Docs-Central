# Mozilla Docs Central

A web server which hosts a directory of all published [Mozilla
Docs](https://github.com/vtsatskin/mozilla-docs). Stores known docs between
sessions to the filesystem.


## Requirements

* node
* npm


## Installation

    > npm install
    > npm start

Your mozilla-central should be accessible at http://localhost:3000


## API

### GET /

Returns a JSON object of all the stored objects. An example:

    {
      "Firefox Desktop": {
        "InContent": {
          "Network Error Pages 2": {
            "product": "Firefox Desktop",
            "component": "InContent",
            "name": "Network Error Pages 2",
            "git": "https://github.com/vtsatskin/fx-network-errors.git",
            "url": "http://vtsatskin.github.io/fx-network-errors"
          }
        }
      }
    }

### POST /doc/register

Registers a Mozilla Doc into the database. If a doc already exists with the same
product, component and name, it will return the existing one.

Expects a JSON payload such as:

    {
      config: {
        product: "Firefox Desktop",
        component: "InContent",
        name: "Network Error Pages 2"
      },
      github_remote: "https://github.com/vtsatskin/fx-network-errors.git"
    }
