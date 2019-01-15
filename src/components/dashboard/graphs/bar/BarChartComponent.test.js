import React from 'react'
import ReactDOM from 'react-dom'
import BarChartComponent from './BarChartComponent'
import Renderer from 'react-test-renderer'
import { shallow } from 'enzyme'

it('barchart renders without crashing', () => {
  const div = document.createElement('div')
  ReactDOM.render(
    <BarChartComponent dataSet={data()} responsive={{ width: 250, height: '100%' }}/>, 
    div
  )
})

function createNodeMock() {
  const doc = document.implementation.createHTMLDocument();
  return { parentElement: doc.body };
}

function data(){
  return [
    {
      color: '#32b4f1',
      dataKey: 'value',
      nameKey: 'name',
      data: [{ name: 'POST', value: 78 }, { name: 'GET', value: 271 }],
      label: true
    }
  ]
}

describe('Barchart', () => {
  test('renders properly', () => {
    const tree = Renderer.create(
      <BarChartComponent dataSet={data()} responsive={{ width: 250, height: '100%' }} />,
      { createNodeMock }
    ).toJSON();
    expect(tree).toMatchSnapshot();
  });
});