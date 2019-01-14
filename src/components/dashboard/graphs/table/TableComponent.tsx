import * as React from 'react'

import { IGraphComponentData } from '../../../../statics/types'
import './TableComponent.scss'


interface ITableComponentProps {
  dataSet: IGraphComponentData[]
  rows: Array<{ key: string, txt: string }>
  showHeader?: boolean
  direction?: 'horizontal' | 'vertical'
}

export default class TableComponent extends React.PureComponent<ITableComponentProps, {}> {
  constructor(props: ITableComponentProps) {
    super(props)
  }

  public render() {
    const { dataSet, rows, showHeader } = this.props 
    const headers = showHeader ? this.getHeaders(rows) : null
    const cells = dataSet.map(set => set.data.map((obj, index) => this.getCell(obj, rows, index)))

    return (
      <div className="table-component">
        {headers}
        <div className="cells">{cells}</div>
      </div>
    )
  }

  private getHeaders = (rows : ITableComponentProps['rows']) => {
    return (
      <div className="row headers">
        {rows.map((row, index) => <div key={index} className={`col-${index}`}>{row.txt}</div>)}
      </div>
    )
  }

  private getCell = (data : object, rows : ITableComponentProps['rows'], index: number) => {
    return (
      <div className="row" key={index}>
        {rows.map(row => data[row.key]).map((cell, i) => <div key={i} className={`col-${index}`}>{cell}</div>)}
      </div>
    )
  }
}