# Elm-ulator

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

## Deployment

1. Set the heroku app to the [static buildpack](https://github.com/heroku/heroku-buildpack-static):

    ```bash
    heroku buildpacks:set https://github.com/heroku/heroku-buildpack-static.git.
    ```

## Documentation

* [8080 By Opcode](./docu/opcodes.md)

## Links

* <https://elm-lang.org>
* <https://github.com/Malax/elmboy>
* <http://emulator101.com>
