[![Actions Status](https://github.com/takuyaohashi/setup-flutter/workflows/Main%20workflow/badge.svg)](https://github.com/takuyaohashi/setup-flutter/actions)

# setup-flutter

This action sets up a flutter environment for use in actions by:

* optionally downloading and caching a version of flutter by version and adding to PATH

# Usage

See [action.yml](action.yml)

Basic:
```yaml
steps:
- uses: actions/checkout@v1
- uses:
  with:
    flutter-version: 
- run: 
```