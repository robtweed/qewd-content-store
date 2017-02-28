/*

 ------------------------------------------------------------------------------------
 | qewd-monitor: React.js-based Monitor/Management Application for QEWD             |
 |                                                                                  |
 | Copyright (c) 2017 M/Gateway Developments Ltd,                                   |
 | Reigate, Surrey UK.                                                              |
 | All rights reserved.                                                             |
 |                                                                                  |
 | http://www.mgateway.com                                                          |
 | Email: rtweed@mgateway.com                                                       |
 |                                                                                  |
 |                                                                                  |
 | Licensed under the Apache License, Version 2.0 (the "License");                  |
 | you may not use this file except in compliance with the License.                 |
 | You may obtain a copy of the License at                                          |
 |                                                                                  |
 |     http://www.apache.org/licenses/LICENSE-2.0                                   |
 |                                                                                  |
 | Unless required by applicable law or agreed to in writing, software              |
 | distributed under the License is distributed on an "AS IS" BASIS,                |
 | WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.         |
 | See the License for the specific language governing permissions and              |
 |  limitations under the License.                                                  |
 ------------------------------------------------------------------------------------

  3 January 2016

*/

"use strict"

var React = require('react');
var ReactBootstrap = require('react-bootstrap');
var FormField = require('./FormField');

var {
  Button,
  Panel
} = ReactBootstrap;

var AddStore = React.createClass({

  getInitialState: function() {
    return {
      status: 'initial',
      tagValue: ''
    }
  },

  componentWillMount: function() {
    this.controller = require('./controller-AddStore')(this.props.controller, this);

    this.title = (
      <span>
          <b>Add a New Store</b>
          <Button 
            bsClass="btn btn-primary pull-right"
            onClick = {this.cancel}
          >
            Cancel
          </Button>
      </span>
    );
  },

  componentWillReceiveProps: function(newProps) {
    console.log('AddStore receiving new props: ' + JSON.stringify(newProps));
    this.show = newProps.data.show;
    this.subjectDelimiters = newProps.data.subjectDelimiters || '~~';
    this.valueDelimiters = newProps.data.valueDelimiters || '||';
    this.unitDelimiters = newProps.data.unitDelimiters || '{}';

  },


  render: function() {

    console.log('Rendering AddStore');
    //var componentPath = this.controller.updateComponentPath(this);
    
    var display = '';
    if (!this.show) display = 'hidden';

    return (
      <div
        className = {display}
      >
        <Panel
  	 header={this.title}
          bsStyle="info"
        >
          <FormField
            placeholder='Enter a name for the store'
            fieldname='storeName'
            label='New Store Name'
            type='text'
            controller = {this.controller}
            focus={true}
            value = {this.storeName}
            formModule = 'AddStore'
          />

          <FormField
            placeholder='Enter L&R Subject Delimiters'
            fieldname='subjectDelimiters'
            label='Subject Delimiters'
            type='text'
            controller = {this.controller}
            value = {this.subjectDelimiters}
            formModule = 'AddStore'
          />

          <FormField
            placeholder='Enter L&R Value Delimiters'
            fieldname='valueDelimiters'
            label='Value Delimiters'
            type='text'
            controller = {this.controller}
            value = {this.valueDelimiters}
            formModule = 'AddStore'
          />

          <FormField
            placeholder='Enter L&R Unit Delimiters'
            fieldname='unitDelimiters'
            label='Unit Delimiters'
            type='text'
            controller = {this.controller}
            value = {this.unitDelimiters}
            formModule = 'AddStore'
          />


          <Button
           onClick={this.handleSubmit}
           bsStyle='primary'
          >
            Save
          </Button>

        </Panel>
      </div>
    );
  }
});

module.exports = AddStore;
