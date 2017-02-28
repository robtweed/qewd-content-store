/*

 ----------------------------------------------------------------------------
 | qewd-content-store: Content store using semi-structured free text        |
 |                                                                          |
 | Copyright (c) 2017 M/Gateway Developments Ltd,                           |
 | Redhill, Surrey UK.                                                      |
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

  3 February 2017

*/

var kwx = require('keyword-extractor');

String.prototype.replaceAll = function(target, replacement) {
  return this.split(target).join(replacement);
};

function extractWords(string) {
  string = string.replaceAll('|', '');
  string = string.replaceAll('~', '');
  string = string.replaceAll('{', '');
  string = string.replaceAll('}', '');
  string = string.replaceAll('+', '');
  string = string.replaceAll('-', '');
  string = string.replaceAll('/', '');
  var params = {
    language: 'english',
    remove_digits: true,
    return_changed_case: true,
    remove_duplicates: true
  };
  return kwx.extract(string, params);
}

module.exports = extractWords;
