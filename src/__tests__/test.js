import React from 'react';
import {shallow} from 'enzyme';
import TestComponent from './TestComponent';

test('does this work?', () => {
  // Render a checkbox with label in the document
  const checkbox = shallow(
    <TestComponent/>
  );

  expect(checkbox.find('div').length).toEqual(1);

  //console.log("helllooooo" + checkbox.find('select').length);

  //expect(checkbox.text()).toEqual('On');
});