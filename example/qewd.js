/*

 ----------------------------------------------------------------------------
 | qewd: Quick and Easy Web Development                                     |
 |                                                                          |
 | Copyright (c) 2017 M/Gateway Developments Ltd,                           |
 | Reigate, Surrey UK.                                                      |
 | All rights reserved.                                                     |
 |                                                                          |
 | http://www.mgateway.com                                                  |
 | Email: rtweed@mgateway.com                                               |
 |                                                                          |
 |                                                                          |
 | Licensed under the Apache License, Version 2.0 (the "License");          |
 | you may not use this file except in compliance with the License.         |
 | You may obtain a copy of the License at                                  |
 |                                                                          |
 |     http://www.apache.org/licenses/LICENSE-2.0                           |
 |                                                                          |
 | Unless required by applicable law or agreed to in writing, software      |
 | distributed under the License is distributed on an "AS IS" BASIS,        |
 | WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. |
 | See the License for the specific language governing permissions and      |
 |  limitations under the License.                                          |
 ----------------------------------------------------------------------------

  3 January 2017

*/


var config = {
  managementPassword: '123',
  serverName: 'New QEWD Server',
  port: 8080,
  poolSize: 1,
  database: {
    type: 'gtm'
  }
};

var routes = [
  {path: '/xml', module: 'xml'},
  {path: '/api', module: 'api-content-store'},
];

config.addMiddleware = function(bodyParser, app) {
  require('body-parser-xml')(bodyParser);
  app.use(bodyParser.xml());
};

var qewd = require('qewd').master;
var q = qewd.start(config, routes);

q.userDefined.contentStoreDocumentName = 'qewdCS';


