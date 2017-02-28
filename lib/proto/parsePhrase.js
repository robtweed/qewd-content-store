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

var getElement = require('./getElement');
var removeDelimiters = require('./removeDelimiters');
var isNumeric = require('./isNumeric');

function parsePhrase(phrase) {
  // '*Internal rotation* to |?| {degrees}'
  var originalPhrase = phrase;
  var value;
  var unit;
  var result = getElement.call(this, phrase, 'subject');
  var subject = result.element;
  phrase = result.phrase;
  result = getElement.call(this, phrase, 'value');
  value = result.element;
  phrase = result.phrase;
  result = getElement.call(this, phrase, 'unit');
  unit = result.element;
  phrase = result.phrase;
  phrase = phrase.replaceAll('[[', '{{') ;
  phrase = phrase.replaceAll(']]', '}}') ;
  var uiPhrase = originalPhrase.toString();
  if (subject !== '?') var uiPhrase = removeDelimiters.call(this, uiPhrase, 'subject');
  if (value !== '?') uiPhrase = removeDelimiters.call(this, uiPhrase, 'value');
  if (unit !== '?') uiPhrase = removeDelimiters.call(this, uiPhrase, 'unit');
  uiPhrase = uiPhrase.replace(/ +(?= )/g,'');  // remove multiple spaces
  //console.log('** phrase = ' + phrase);
  var phraseObj = {
    authoredPhrase: originalPhrase,
    phrase: phrase,
    uiPhrase: uiPhrase,
    subject: {
      display: subject,
      value: subject.toLowerCase()
    }
  };

  //console.log('** phraseObj = ' + JSON.stringify(phraseObj, null, 2));

  if (unit) {
    phraseObj.unit = {
      display: unit,
      value: unit.toLowerCase()
    };
  }

  //console.log('** phraseObj = ' + JSON.stringify(phraseObj, null, 2));

  if (value) {
    if (value === '?') {
      phraseObj.value = '?';
    }
    else {
      if (isNumeric(value)) {
        phraseObj.value = {
          display: value,
          value: value
        };
      }
      else {
        phraseObj.value = {
          display: value,
          value: value.toString().toLowerCase()
        };
      }
    }
  }
  //console.log('** phraseObj = ' + JSON.stringify(phraseObj, null, 2));
  return phraseObj;
}

module.exports = parsePhrase;
