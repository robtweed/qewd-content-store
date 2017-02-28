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

  component.storeName = '';
  component.subjectDelimiters = '~~';
  component.valueDelimiters = '||';
  component.unitDelimiters = '{}';

  component.show = component.props.data.show;

  component.cancel = function() {
    controller.emit('cancelAddStore');
  };

  controller.AddStore = {
    onFieldChange: function(inputObj) {
      console.log('onFieldChange - ' + inputObj.ref + '; ' + inputObj.value);
      component[inputObj.ref] = inputObj.value;
    }
  };

  component.handleKeyDown = function(e) {
    // enter key pressed
    if (e.charCode === 13) {
      component.handleSubmit();
    }
  };

  component.handleSubmit = function() {

    console.log('component.storeName = ' + JSON.stringify(component.storeName));

    if (component.storeName === '') {
      controller.displayError('You must enter a Store name');
      return;
    }

    if (component.subjectDelimiters === '' || component.subjectDelimiters.length !== 2) {
      controller.displayError('You must enter L&R Subject delimiters');
      return;
    }

    if (component.valueDelimiters === '' || component.valueDelimiters.length !== 2) {
      controller.displayError('You must enter L&R Value delimiters');
      return;
    }

    if (component.unitDelimiters === '' || component.unitDelimiters.length !== 2) {
      controller.displayError('You must enter L&R Unit delimiters');
      return;
    }

    if (component.subjectDelimiters === component.valueDelimiters) {
      controller.displayError('Subject and Value delimiters must be different');
      return;
    }

    if (component.subjectDelimiters === component.unitDelimiters) {
      controller.displayError('Subject and Unit delimiters must be different');
      return;
    }

    if (component.valueDelimiters === component.unitDelimiters) {
      controller.displayError('Value and Unit delimiters must be different');
      return;
    }

    // send submit message
    //   response handler subscription is in parent component (PhrasePanel)

    controller.send({
      type: 'saveStore',
      params: {
        storeName: component.storeName,
        subjectDelimiters: component.subjectDelimiters,
        valueDelimiters: component.valueDelimiters,
        unitDelimiters: component.unitDelimiters
      }
    });
  };

  return controller;
};
