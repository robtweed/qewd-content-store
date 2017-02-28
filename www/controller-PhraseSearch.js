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

  7 February 2017

*/

module.exports = function (controller, component) {

  component.show = component.props.data.show;
  component.options = component.props.data.options;
  component.prefix = component.props.data.prefix;

  component.cancel = function() {
    controller.emit('cancelPhraseSearch');
  };

  component.selectPhrase = function(option) {
    console.log('phrase selected: ' + JSON.stringify(option));
    controller.send({
      type: 'selectPhrase',
      params: {
        phrase: option.value
      }
    });
  };

  controller.PhraseSearch = {
    onFieldChange: function(inputObj) {
      console.log('onFieldChange - ' + inputObj.ref + '; ' + inputObj.value);
      component[inputObj.ref] = inputObj.value;

      if (inputObj.ref === 'phrasePrefix') {
        console.log('trigger search for ' + component.phrasePrefix);
        controller.send({
          type: 'getPhrasesByPrefix',
          params: {
            prefix: component.phrasePrefix
          }
        });
      }

    }
  };

  component.handleKeyDown = function(e) {
    // enter key pressed
    if (e.charCode === 13) {
      component.handleSubmit();
    }
  };

  component.handleSubmit = function() {

    if (component.tagName === '') {
      controller.displayError('You must enter a tag name');
      return;
    }

    if (component.phrases === '') {
      controller.displayError('You must enter at least one phrase');
      return;
    }

    // send submit message
    //   response handler subscription is in parent component (PhrasePanel)

    controller.send({
      type: 'addTags',
      params: {
        tag: component.tagName,
        phrases: component.phrases
      }
    });
  };

  return controller;
};
