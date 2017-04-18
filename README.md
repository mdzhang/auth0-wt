# auth0-wt

Playing around with [Auth0 Webtasks](https://github.com/auth0/wt-cli)

## Table of Contents

- [Installation](#installation)
- [Running](#running)

## Installation

1. Install [Homebrew](http://brew.sh) for managing software packages on OS X
    ```
    /usr/bin/ruby -e "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install)"
    ```

1. Install [Homebrew Bundle](https://github.com/Homebrew/homebrew-bundle) for bundling packages with Homebrew
    ```
    brew tap Homebrew/bundle
    ```

1. Configure your shell to enable automatic environment variable loading
    ```
    # in e.g. ~/.bash_profile

    if which direnv > /dev/null; then
      eval "$(direnv hook bash)"
    fi
    ```

    * Restart shell so that changes take effect

        ```
        source ~/.bash_profile
        ```

1. Clone and enter this repo
    ```sh
    git clone git@github.com:mdzhang/auth0-wt.git
    cd auth0-wt
    ```

1. Install Homebrew packages
    ```sh
    brew bundle
    ```

1. Follow Javascript setup steps [here](https://github.com/mdzhang/guides/blob/master/DEV_SETUP.md#javascript)

1. Install development environment variables
    ```sh
    cp .envrc.sample .envrc
    direnv allow
    ```

## Running

TODO
