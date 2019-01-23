import * as React from 'react'
import { Bar, BarChart, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'  
import { IGraphComponentData } from '../../../../statics/types'

interface IBarComponentProps {
  dataSet: IGraphComponentData[]
  dimensions?: { width: number, height: number }
  responsive?: { width: '100%', height: number } | { width: number, height: '100%' }
  showLabel?: boolean
  xkey: string
  valueFormatter? : (value: any) => any
}

export default class BarChartComponent extends React.PureComponent<IBarComponentProps, {}> {
  constructor(props : IBarComponentProps) {
    super(props)
  }

  public render() {
    const { dataSet, responsive, dimensions, xkey, valueFormatter } = this.props

    const bars = dataSet.map((data, key) => {
      return (
        <Bar 
          key={key}
          dataKey={data.dataKey}
          label={data.label} 
          fill={data.color}
        />
      )})

    return responsive
      ? (
        <ResponsiveContainer minHeight={250} minWidth={250} width={responsive.width} height={responsive.height}>
          <BarChart data={dataSet[0].data}>
            <Bar dataKey={dataSet[0].dataKey} fill="#8884d8" />
            <XAxis dataKey={dataSet[0].nameKey}/>
            <YAxis />
            <Legend />
            <Tooltip formatter={(value) => valueFormatter ? valueFormatter(value) : value}/>
          </BarChart>
        </ResponsiveContainer>
      )
      : dimensions && (
        <BarChart width={dimensions.width} height={dimensions.height} data={dataSet[0].data}>
          {bars}
          <XAxis dataKey={xkey}/>
          <YAxis/>
          <Legend />
          <Tooltip formatter={(value) => valueFormatter ? valueFormatter(value) : value}/>        
          </BarChart>
      )
    }
}