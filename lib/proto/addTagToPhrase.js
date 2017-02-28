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

function addTagToPhrase(phraseId, tag) {
  if (!phraseId || phraseId === '') return {ok: false};
  if (!tag || tag === '') return {ok: false};
  if (!this.phraseIdExists(phraseId)) return {ok: false};

  this.contentStoreDoc.$(['byId', phraseId, 'tags', tag.toLowerCase()]).value = '';
  return {
    ok: true,
    newTag: !this.tagExists(tag)
  };
}

module.exports = addTagToPhrase;
