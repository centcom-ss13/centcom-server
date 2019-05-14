# CentCom
### *The SS13 Management Service*

[Demo Site](http://centcom.ddmers.com) - [Github Organization](https://github.com/centcom-ss13) - [Service Homepage](https://centcom.services) (coming soon!)

### @centcom/server

The back-end REST API for CentCom

## Building
Note: This module lists `npm-run-all` as a dev dependency, and uses it for commands such as `run-s test` and `run-s build start`, which are substitutes for `npm run test` and `npm run build && npm run start` respectively.  You can learn more at the [npm-run-all npm page](https://www.npmjs.com/package/npm-run-all).

This module includes database configuration and migrations.  Configuration is contained within `/src/config` for the specified `NODE_ENV` environment variable.

 - `run-s build` - Build the server into a bundle located at `/dist/bundle.js`
 - `run-s start` - Run the compiled JS bundle
 - `run-s test` - Run the mocha tests
 
## Contributing

Issues and PRs are welcomed on all codebases - feel free to contact me personally with any questions!