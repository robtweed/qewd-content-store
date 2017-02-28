# qewd-content-store: Content/Terminology Store using semi-structured free text
 
Rob Tweed <rtweed@mgateway.com>  
3 January 2017, M/Gateway Developments Ltd [http://www.mgateway.com](http://www.mgateway.com)  

Twitter: @rtweed

Google Group for discussions, support, advice etc: [http://groups.google.co.uk/group/enterprise-web-developer-community](http://groups.google.co.uk/group/enterprise-web-developer-community)

## Dependencies

*qewd-content-store* assumes that you've already installed
[QEWD](https://github.com/robtweed/qewd)


## Installing

       npm install qewd-content-store

  Then, assuming you've installed QEWD under the ~/qewd directory, install the authoring
  application using:

       cd ~/qewd/www
       mkdir qewd-content-store
       cp ~/qewd/node_modules/qewd-content-store/www/* ~/qewd/www/qewd-content-store

## What is *qewd-content-store*?

*qewd-content-store* allows you to create sets of phrases or terminologies that can optionally 
contain *triplets* of information:

  - a subject
  - optionally, a value
  - optionally, a unit

Each of these is defined during authoring by using a specific delimiter.  By default these are:

  ~This is the subject~
  |This is a value|
  {This is a unit}

For example:

  ~Shoulder pain~ on |right| {side}


The content store can contain one or more store names.  The store names are up to you.

Within each store name, you can define phrases and tags:

- a phrase can have one or more tags
- a tag can have one or more phrases associated with it

The number, structure and content of phrases and tags is up to you.

## Purpose of *qewd-content-store*

The purpose of *qewd-content-store* is to create sets of semi-structured text that can be assigned to
entities within an application (eg phrases that describe symptoms, observations and/or treatment of
patients).  The content store contains pre-parsed versions of each phrase and therefore knows the
associated subject, value and/or unit within that phrase, each of which can then be assigned against the
target entity (eg a patient).

As a result, what appear to be straightforward unstructured phrases saved against an entity can be
used as searchable, analysable data.


## Authoring Phrases

Start the Authoring application.  This is a QEWD browser-based application, invoked using the URL:

      http://xx.xx.xx.xx:{port}/qewd-content-store/index.html

By default, log in with any username, and use the QEWD management password as the password.

You can then add a new store name and begin defining tags and phrases



## Retrieving Phrases via REST

To be completed

including how to set up the REST interface



## License

 Copyright (c) 2017 M/Gateway Developments Ltd,                           
 Reigate, Surrey UK.                                                      
 All rights reserved.                                                     
                                                                           
  http://www.mgateway.com                                                  
  Email: rtweed@mgateway.com                                               
                                                                           
                                                                           
  Licensed under the Apache License, Version 2.0 (the "License");          
  you may not use this file except in compliance with the License.         
  You may obtain a copy of the License at                                  
                                                                           
      http://www.apache.org/licenses/LICENSE-2.0                           
                                                                           
  Unless required by applicable law or agreed to in writing, software      
  distributed under the License is distributed on an "AS IS" BASIS,        
  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. 
  See the License for the specific language governing permissions and      
   limitations under the License.      
