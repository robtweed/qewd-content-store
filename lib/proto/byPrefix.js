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

  21 February 2017

*/

function byPrefix(prefix, max, property) {
  var results = [];
  if (!prefix || prefix === '') return results;
  max = max || this.maxMatches;

  var indexDoc = this.contentStoreDoc.$('byWord');
  var params = {
    prefix: prefix
  };
  var results = [];
  var idFound = {};
  var count = 0;
  var self = this;
  indexDoc.forEachChild(params, function(index, childNode) {
    childNode.forEachChild(function(id) {
      if (!idFound[id]) {
        results.push({
          id: id,
          phrase: self.get(id, property)
        });
        idFound[id] = true;
        count++;
        if (count === max) return true;
      }
    });
    if (count === max) return true;
  });
  return results;
}

module.exports = byPrefix;
