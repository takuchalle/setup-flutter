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
- uses: takuyaohashi/setup-flutter@v1
  with:
    flutter-version: 'latest'
    channel: 'stable'
- run: flutter test
```

Matrix Testing:
```yaml
jobs:
  test:
    runs-on: ubuntu-latest
    strategy:
      matrix:
        flutter: [ 'latest', 'v1.9.1+hotfix.6' ]
    steps:
    - uses: actions/checkout@v1
    - uses: takuyaohashi/setup-flutter@v1
      with: 
        flutter-version: ${{ matrix.flutter }}
        channel: 'stable'
    - name: test
      run: flutter test
```

# License

The scripts and documentation in this project are released under the [MIT License](LICENSE)
