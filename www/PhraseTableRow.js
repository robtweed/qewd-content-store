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
  ButtonGroup,
  Glyphicon,
  OverlayTrigger,
  Popover,
  Table,
  Tooltip
} = ReactBootstrap;

var PhraseTableRow = React.createClass({

  getInitialState: function() {
    return {
      status: 'initial'
    }
  },

  componentWillMount: function() {
    this.controller = require('./controller-PhraseTableRow')(this.props.controller, this);

    this.selectTooltip = (
      <Tooltip 
        id = "selectBtn"
      >
        Select and maintain this phrase
      </Tooltip>
    );

    this.untagTooltip = (
      <Tooltip 
        id = "untagBtn"
      >
        Remove this phrase from the current tag
      </Tooltip>
    );

    this.popoverTitle = (
      <span>
        <b>Insert New Phrase</b>
        <Button 
          bsClass="btn btn-primary btn-xs pull-right"
          onClick = {this.closePopover}
        >
          Close
        </Button>
      </span>
    );

    this.phraseEntry = (
        <Popover
          id = {this.props.id + '-popover'}
          title = {this.popoverTitle}
        >
          <FormField
            placeholder='New Phrase'
            fieldname='newPhrase'
            label='New Phrase'
            type='text+button'
            controller = {this.controller}
            formModule = 'PhraseTableRow'
            btnHandler = {this.insertPhrase}
            btnStyle = 'success'
            btnText = 'Insert'
          />
        </Popover>
    );


  },

  componentWillReceiveProps: function(newProps) {
    this.onNewProps(newProps);
  },

  render: function() {

    //console.log('Rendering SessionTableRow');
    //var componentPath = this.controller.updateComponentPath(this);

    return (
      <tr>
        <td>
            {this.props.phrase}
        </td>
        <td>
          <ButtonGroup
            bsClass="pull-right"
          >
            <OverlayTrigger 
              placement="top" 
              overlay={this.selectTooltip}
            >
              <Button 
                bsStyle="info"
                onClick = {this.selectPhrase}
                bsSize="small"
              >
                <Glyphicon 
                  glyph="info-sign"
                />
              </Button>
            </OverlayTrigger>

            <OverlayTrigger 
              placement="top" 
              overlay={this.untagTooltip}
            >
              <Button 
                bsStyle="danger"
                onClick = {this.deletePhraseFromTag}
                bsSize="small"
              >
                <Glyphicon 
                  glyph="scissors"
                />
              </Button>
            </OverlayTrigger>

            <OverlayTrigger
              ref = {'overlay-ref-' + this.props.id}
              placement="right"
              trigger = 'click'
              onEnter = {this.overlayOpen}
              onExit = {this.overlayClosed}
              overlay={this.phraseEntry}
            >
              <Button 
                id = {this.props.id + '-insertBtn'}
                bsStyle="success"
                bsSize="small"
              >
                <Glyphicon 
                  glyph="share-alt"
                />
              </Button>
            </OverlayTrigger>
          </ButtonGroup>
        </td>
      </tr>
    );
  }
});

module.exports = PhraseTableRow;
