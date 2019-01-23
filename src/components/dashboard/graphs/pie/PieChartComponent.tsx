import * as React from 'react'
//import { I18n } from 'react-redux-i18n'
import { Pie, PieChart, ResponsiveContainer, Tooltip, Cell } from 'recharts'  
import { IGraphComponentData } from '../../../../statics/types'

interface IPieComponentProps {
  dataSet: IGraphComponentData[]
  dimensions?: { width: number, height: number }
  responsive?: { width: '100%', height: number } | { width: number, height: '100%' }
  showLabel?: boolean
}

export default class PieChartComponent extends React.PureComponent<IPieComponentProps, {}> {
  constructor(props : IPieComponentProps) {
    super(props)
  }

  public render() {
    const { dataSet, responsive, dimensions } = this.props  
    const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];
    const colorIndex = {
      'Low': 'rgb(159, 197, 232)',
      'Medium': 'rgb(255, 229, 153)',
      'High': 'rgb(224, 102, 102)',
      'Critical': 'rgb(103, 78, 167)',
    }

    const pies = dataSet.map((data, key) => {
      return (
        <Pie 
          key={key} 
          data={data.data} 
          dataKey={data.dataKey} 
          nameKey={data.nameKey} 
          label={true} 
          labelLine={true}
          //fill={data.color || '#32b4f1'}
          cx={'50%'}
          cy={'50%'}
        >
          {data.data.map((entry, index) => <Cell key={index} fill={colorIndex[entry.risk] || COLORS[index % 4] }/>)}
        </Pie>
      )}
    )

    return responsive ? (
        <ResponsiveContainer minHeight={150} minWidth={250} maxHeight={150} width={responsive.width} height={responsive.height}>
          <PieChart>
            {pies}
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      )
    : dimensions && (
      <PieChart width={dimensions.width} height={dimensions.height}>
        {pies}
        <Tooltip />
      </PieChart>
    )
  }
}