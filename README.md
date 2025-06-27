# peony-admin

Admin frontend for [peony](https://github.com/einar-hjortdal/peony).

SPA powered by [Dark](https://github.com/atellmer/dark/tree/master), simple deployment with [freeNGINX](https://freenginx.org/).

## Scripts

- `test`: runs tests.
- `build`: builds the application for deployment.
- `dev`: builds the application and starts the [dev server](dev-server.js).
- `deploy.sh`: sets up a container.
- `undeploy.sh`: stops and removes the container.

Note: before deploying
- Edit URLs in [config.js](src/shared/config.js)
- Verify [public](public/) contains the required files

## Development

To add a language follow these steps:

1. Add a language to the `languages` array in [`src/shared/translations/languages.js`](src/shared/translations/languages.js)
2. Add the language to the `getMessages` function in [`src/shared/translations/utils.js`](src/shared/translations/utils.js)
3. Create a file for the messages in [`src/shared/translations/messages/`](src/shared/translations/messages/)
4. Import the file and add it to the `getMessagesSync` function in [`src/server/utils.js`](src/server/utils.js)