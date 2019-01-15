// import * as React from 'react'
// import './Dashboard.scss'
// import ReactDOM from 'react-dom'
// import Renderer from 'react-test-renderer'
// import { shallow } from 'enzyme'
// import Dashboard from './Dashboard'
// import BarChartComponent from './Dashboard'
// import PieChartComponent from './Dashboard'
// import TableComponent from './Dashboard'
// import { connect } from 'react-redux'
// import { RouteComponentProps, withRouter } from 'react-router'
// import { Dispatch } from 'redux'

// it('dashboard tablecomponent renders without crashing', () => {
//     const div = document.createElement('div')
//     ReactDOM.render(
//       <TableComponent dataSet={data()} rows={[{ key: 'name', txt: 'Name' }, { key: 'value', txt: 'Value'}]} showHeader direction={'vertical'}/>, 
//       div
//     )
//   })
  
// it('dashboard tablecomponent renders correctly', () => {
//     const tree = Renderer
//     .create(<TableComponent dataSet={data()} rows={[{ key: 'name', txt: 'Name' }, { key: 'value', txt: 'Value'}]} showHeader direction={'vertical'} />)
//     .toJSON()
  
//     expect(tree).toMatchSnapshot()
//   })

// it('dashboard piechart renders without crashing', () => {
//     const div = document.createElement('div')
//     ReactDOM.render(
//       <PieChartComponent dataSet={data()} responsive={{ width: 250, height: '100%' }}/>, 
//       div
//     )
//   })
  
// it('dashboard piechart renders correctly', () => {
//     const tree = Renderer
//     .create(<PieChartComponent dataSet={data()} responsive={{ width: 250, height: '100%' }} />)
//     .toJSON()
  
//     expect(tree).toMatchSnapshot()
//   })

// it('dashboard barchart renders without crashing', () => {
//     const div = document.createElement('div')
//     ReactDOM.render(
//       <BarChartComponent dataSet={data()} responsive={{ width: 250, height: '100%' }}/>, 
//       div
//     )
//   })
  
// it('dashboard barchart renders correctly', () => {
//     const tree = Renderer
//     .create(<BarChartComponent dataSet={data()} responsive={{ width: 250, height: '100%' }} />)
//     .toJSON()
  
//     expect(tree).toMatchSnapshot()
//   })

//   function data(){
//   return [
//     {
//       color: '#32b4f1',
//       dataKey: 'value',
//       nameKey: 'name',
//       data: [{ name: 'POST', value: 78 }, { name: 'GET', value: 271 }],
//       label: true
//     }
//   ]
// }