# Elm-ulator [![Build Status](https://travis-ci.org/lakermann/elmulator.svg?branch=master)](https://travis-ci.org/lakermann/elmulator)

_by [Samuel Bucheli](https://github.com/SamuelBucheliZ), [Stefan Friedli](https://github.com/sfriedli) and [Lukas Akermann](https://github.com/lakermann)_

* <https://lakermann.github.io/elmulator>

## Developer Onboarding

1. Install Visual Studio Code.

2. Install Visual Studio Code elm extension

3. Run `npm install`

4. Then, in `.vscode/settings.json`, add the following:

    ```json
    "elm.compiler": "./node_modules/.bin/elm",
    "elm.makeCommand": "./node_modules/.bin/elm-make"
    "elm.formatCommand": "./node_modules/.bin/elm-format",
    "[elm]": {
        "editor.formatOnSave": true
    }
    ```

## Documentation

* [8080 By Opcode](./docu/opcodes.md)

## Links

* <https://elm-lang.org>
* <https://github.com/Malax/elmboy>
* <http://emulator101.com>
