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
var Select = require('react-select');
var FormField = require('./FormField');

var {
  Button,
  ControlLabel,
  FormGroup,
  Glyphicon,
  Panel,
  Tooltip,
  OverlayTrigger
} = ReactBootstrap;

var Stores = React.createClass({

  getInitialState: function() {
    return {
      status: 'initial'
    }
  },

  componentWillMount: function() {
    this.controller = require('./controller-Stores')(this.props.controller, this);

    this.tooltip = (
      <Tooltip 
        id = "addStoreBtn"
      >
        Add a new Store
      </Tooltip>
    );

    this.title = (
      <span>
        <b>Stores</b>
        <OverlayTrigger 
          placement="top" 
          overlay={this.tooltip}
        >
          <Button 
            bsClass="btn btn-success pull-right"
            onClick = {this.addStore}
          >
            <Glyphicon 
              glyph="plus"
            />
          </Button>
        </OverlayTrigger>
      </span>
    );

  },

  componentWillReceiveProps: function(newProps) {
    //this.onNewProps(newProps);
    console.log('Stores newProps: ' + JSON.stringify(newProps));
    this.show = newProps.data.show;
    this.value = newProps.data.selectedValue;
    this.options = newProps.data.options;
    this.delimiters = newProps.data.delimiters;
    this.storeName = newProps.data.selectedName;
  },

  addStore: function() {
    console.log('add a new store');
  },

  logChange: function(option) {
    console.log('selected ' + JSON.stringify(option));

    this.selectStore(option);
  }, 

  render: function() {

    console.log('Rendering Stores');
    //var componentPath = this.controller.updateComponentPath(this);

    var display = '';
    if (!this.show) display = 'hidden';
    
    if (this.delimiters.subject) {
      this.subjectExample = this.delimiters.subject.left + 'My Subject' + this.delimiters.subject.right;
      this.valueExample = this.delimiters.value.left + 'My Value' + this.delimiters.value.right;
      this.unitExample = this.delimiters.unit.left + 'My Unit' + this.delimiters.unit.right;

      return (
        <div
          className = {display}
        >
          <Panel
	     header={this.title}
            bsStyle="info"
          >
            <Select
              name="stores"
              value = {this.value}
              options={this.options}
              onChange={this.logChange}
             />

             <hr />
  
            <FormField
              label='Selected Store'
              type='static-inline'
              value = {this.storeName}
            />

            <FormGroup>
              <ControlLabel>Phrase Delimiters:</ControlLabel>
            </FormGroup>
  
            <FormField
              label='Subject'
              type='static-inline'
              value = {this.subjectExample}
            />

            <FormField
              label='Value'
              type='static-inline'
              value = {this.valueExample}
            />

            <FormField
              label='Unit'
              type='static-inline'
              value = {this.unitExample}
            />
          </Panel>
        </div>
      );
    }
    else if (this.options.length > 0) {
      return (
        <div
          className = {display}
        >
          <Panel
  	   header={this.title}
            bsStyle="info"
          >
            <Select
              name="stores"
              value = {this.value}
              options={this.options}
              onChange={this.logChange}
            />
          </Panel>
        </div>
      );
    }
    else {
      return (
        <div
          className = {display}
        >
          <Panel
  	   header={this.title}
            bsStyle="info"
          />
        </div>
      );
    }
  }
});

module.exports = Stores;
