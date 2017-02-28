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

  component.selectTag = function(option) {
    if (!option) return;
    controller.send({
      type: 'selectTag',
      params: {
        tag: option.label,
        no: option.value
      }
    });
  };

  component.addTag = function() {
    console.log('*** addTag in controller-Tags');
    controller.emit('addTag');
  };

  console.log('controller-Tags props: ' + JSON.stringify(component.props));

  component.tagName = component.props.data.selectedName;
  component.storeName = component.props.data.storeName;
  component.options = component.props.data.options;

  return controller;
};
