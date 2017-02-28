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

  component.phrases = '';

  component.show = component.props.data.show;
  component.tagName = component.props.data.tagName || '';

  controller.AddTag = {
    onFieldChange: function(inputObj) {
      console.log('onFieldChange - ' + inputObj.ref + '; ' + inputObj.value);
      component[inputObj.ref] = inputObj.value;
    }
  };

  component.cancel = function() {
    controller.emit('cancelAddTag');
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
