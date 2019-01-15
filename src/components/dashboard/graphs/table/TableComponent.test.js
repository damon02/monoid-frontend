import React from 'react'
import ReactDOM from 'react-dom'
import TableComponent from './TableComponent'
import Renderer from 'react-test-renderer'
import { shallow } from 'enzyme'

it('tablecomponent renders without crashing', () => {
  const div = document.createElement('div')
  ReactDOM.render(
    <TableComponent dataSet={data()} rows={[{ key: 'name', txt: 'Name' }, { key: 'value', txt: 'Value'}]} showHeader direction={'vertical'}/>, 
    div
  )
})

it('tablecomponent renders correctly', () => {
  const tree = Renderer
    .create(<TableComponent dataSet={data()} rows={[{ key: 'name', txt: 'Name' }, { key: 'value', txt: 'Value'}]} showHeader direction={'vertical'} />)
    .toJSON()

  expect(tree).toMatchSnapshot()
})

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