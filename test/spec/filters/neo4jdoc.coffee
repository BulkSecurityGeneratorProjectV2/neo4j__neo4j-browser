###!
Copyright (c) 2002-2016 "Neo Technology,"
Network Engine for Objects in Lund AB [http://neotechnology.com]

This file is part of Neo4j.

Neo4j is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with this program.  If not, see <http://www.gnu.org/licenses/>.
###

'use strict'

describe 'Filter: neo4jdoc', () ->

  # load the filter's module
  beforeEach module 'neo4jApp.filters'

  # initialize a new instance of the filter before each test
  neo4jdoc = {}
  beforeEach inject ($filter) ->
    neo4jdoc = $filter 'neo4jdoc'

  it 'should return major version for 3.0.0', () ->
    text = '3.0.0'
    expect(neo4jdoc text).toBe '3.0'

  it 'should return major version for 2.3.3', () ->
    text = '2.3.3'
    expect(neo4jdoc text).toBe '2.3'

  it 'should return major version on milestones', () ->
    text = '3.0.0-M01'
    expect(neo4jdoc text).toBe '3.0'

  it 'should return "snapshot" for snapshot versions', () ->
    text = '3.0.0-SNAPSHOT'
    expect(neo4jdoc text).toBe 'snapshot'
