import React, { Component } from 'react';

import Table, {
  TableBody,
  TableHeader,
  TableRow,
  TableRowColumn,
  TableHeaderColumn
} from 'material-ui/Table';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import lightBaseTheme from 'material-ui/styles/baseThemes/lightBaseTheme';
import FaArrowUp from 'react-icons/lib/fa/arrow-up';
import FaArrowDown from 'react-icons/lib/fa/arrow-down';

const column = {
  address: "Address",
  date: "Date"
}

const sort = {
  asc: "asc",
  desc: "desc"
}

class SubmissionTable extends Component {
  constructor(props) {
    super(props);

    this.state = {
      order: sort.asc,
      orderBy: column.address,
      submissions: this.props.submissions
    };
  }
  //  Sort submissions
  handleRequestSort = (event, property) => {
    const orderBy = property;
    let order = sort.desc;

    if (this.state.orderBy === property && this.state.order === sort.desc) {
      order = sort.asc;
    }

    const submissions =
      order === sort.desc
        ? this.props.submissions.sort((a, b) => (b[orderBy] < a[orderBy] ? -1 : 1))
        : this.props.submissions.sort((a, b) => (a[orderBy] < b[orderBy] ? -1 : 1));

    this.setState({ submissions, order, orderBy });
  }

  formatDate = (date) => {
    let day = date.getDate() > 9 ? date.getDate() : "0"+date.getDate();
    let month = date.getMonth() > 8 ? date.getMonth() + 1 : "0"+(date.getMonth()+1);
    let year = date.getFullYear();
    let hour = date.getHours() > 9 ? date.getHours() : "0"+date.getHours();
    let minute = date.getMinutes() > 9 ? date.getMinutes() : "0"+date.getMinutes();

    return `${day}-${month}-${year} ${hour}:${minute}`
  }

  render() {
    const { order, orderBy } = this.state;

    let tableData = this.props.submissions.map((sub, index) => {
      return (
            <TableRow
              key={sub.SubmissionId}>
              <TableRowColumn>{sub.Address}</TableRowColumn>
              <TableRowColumn>{this.formatDate(new Date(sub.Date.replace(/\s/, 'T')))}</TableRowColumn>
            </TableRow>
      );
    });
    return (
          <div className="SubmissionTable">

            <Table muiTheme={getMuiTheme(lightBaseTheme)}>

              <TableHeader displaySelectAll={false}
                            adjustForCheckbox={false}>
                <TableRow>
                  <TableHeaderColumn>
                    <label className="head-title" onClick={(e)=> this.handleRequestSort(e, column.address)}>
                      {column.address}
                      {orderBy === column.address && order === sort.asc && <FaArrowUp className="table-head-arrow"/>}
                      {orderBy === column.address && order === sort.desc && <FaArrowDown className="table-head-arrow"/>}
                    </label>
                  </TableHeaderColumn>
                  <TableHeaderColumn>
                    <label className="head-title" onClick={(e)=> this.handleRequestSort(e, column.date)}>
                      {column.date}
                      {orderBy === column.date && order === sort.asc && <FaArrowUp className="table-head-arrow"/>}
                      {orderBy === column.date && order === sort.desc && <FaArrowDown className="table-head-arrow"/>}
                    </label>
                  </TableHeaderColumn>
                </TableRow>
              </TableHeader>
              
              <TableBody displayRowCheckbox={false}
                        showRowHover={true}
                        style={{"cursor": "pointer"}}>
                {tableData}
              </TableBody>
            </Table>
          </div>
    );
  }
}

export default SubmissionTable;
