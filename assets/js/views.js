/** @jsx React.DOM */
var CompaniesItemRow = React.createClass({
  render: function () {
    return (
      <tr>
        <td>{this.props.company.id}</td>
        <td>{this.props.company.title}</td>
      </tr>
    )
  }
});

var CompaniesTable = React.createClass({
  render: function() {
    var companyRows = [];

    this.props.companies.forEach( function (company) {
      companyRows.push( <CompaniesItemRow company={company} /> );
    });

    return (
      <table className="table table-striped">
        <tr>
          <th>#</th>
          <th>title</th>
        </tr>
        <tbody>
          {companyRows}
        </tbody>
      </table>
    );
  }
});