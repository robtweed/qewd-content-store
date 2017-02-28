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

var {
  Button,
  ControlLabel,
  FormGroup,
  Glyphicon,
  Panel,
  Tooltip,
  OverlayTrigger
} = ReactBootstrap;

var Tags = React.createClass({

  getInitialState: function() {
    return {
      status: 'initial',
      tagValue: ''
    }
  },

  componentWillMount: function() {
    this.controller = require('./controller-Tags')(this.props.controller, this);
    this.title = (
      <h2>Tags</h2>
    );
  },

  componentWillReceiveProps: function(newProps) {
    console.log('Tags receiving new props: ' + JSON.stringify(newProps));

    this.tagValue = newProps.data.selectedValue;
    this.tagName = newProps.data.selectedName;
    this.storeName = newProps.data.storeName;
    if (newProps.data.options) this.options = newProps.data.options;

    if (this.storeName && this.storeName !== '') {

      this.tooltip = (
        <Tooltip 
          id = "addTagBtn"
        >
          Add a new Tag
        </Tooltip>
      );

      this.title = (
        <span>
          <b>{this.storeName} Tags</b>
          <OverlayTrigger 
            placement="top" 
            overlay={this.tooltip}
          >
            <Button 
              bsClass="btn btn-success pull-right"
              onClick = {this.addTag}
            >
              <Glyphicon 
                glyph="plus"
              />
            </Button>
          </OverlayTrigger>
        </span>
      );
    }

  },

  logChange: function(option) {
    console.log('selected ' + JSON.stringify(option));
    
    this.selectTag(option);
  }, 

  render: function() {

    console.log('Rendering Tags');
    //var componentPath = this.controller.updateComponentPath(this);

    if (!this.options || this.options.length === 0) {
      return (
      <Panel
	 header={this.title}
        bsStyle="info"
      >
      </Panel>
      );
    }

    return (
      <Panel
	 header={this.title}
        bsStyle="info"
      >

        <Select
          name="tags"
          value = {this.tagValue}
          options={this.options}
          onChange={this.logChange}
         />

      </Panel>
    );
  }
});

module.exports = Tags;
