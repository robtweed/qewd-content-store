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

  9 February 2017

*/

module.exports = function (controller, component) {

  component.selectStore = function(option) {
    controller.send({
      type: 'selectStore',
      params: {
        store: option.value
      }
    });
  };

  component.addStore = function() {
    controller.emit('addStore');
  };

  component.show = component.props.data.show;
  component.value = component.props.data.selectedValue;
  component.options = component.props.data.options;
  component.delimiters = component.props.data.delimiters;
  component.storeName = component.props.data.selectedName;

  return controller;
};
