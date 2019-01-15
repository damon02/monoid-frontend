import React from 'react'
import ReactDOM from 'react-dom'
import PieChartComponent from './PieChartComponent'
import Renderer from 'react-test-renderer'
import { shallow } from 'enzyme'

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

it('piechart renders without crashing', () => {
  const div = document.createElement('div')
  ReactDOM.render(
    <PieChartComponent dataSet={data()} responsive={{ width: 250, height: '100%' }}/>, 
    div
  )
})

describe('Piechart', () => {
  test('renders properly', () => {
    const tree = Renderer.create(
      <PieChartComponent dataSet={data()} responsive={{ width: 250, height: '100%' }} />,
      { createNodeMock }
    ).toJSON();
    expect(tree).toMatchSnapshot();
  });
});

// it('piechart renders correctly', () => {
//   const tree = Renderer
//     .create(<PieChartComponent dataSet={data()} responsive={{ width: 250, height: '100%' }} />)
//     .toJSON()

//   expect(tree).toMatchSnapshot()
// })


