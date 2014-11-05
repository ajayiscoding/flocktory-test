/** @jsx React.DOM */
var CompaniesStatistics = React.createClass({
  getInitialState: function () {
    return {
      minCompaniesInGraph: 2,
      maxCompaniesInGraph: 8,
      selectedCompanies: []
    }
  },

  /* Вкл./Выкл. компанию из сравнения */
  toggleCompanyFunc: function (child) {
    var selectedCompanies = this.state.selectedCompanies;
    var company = child.props.company;

    if (selectedCompanies.length >= this.state.maxCompaniesInGraph) {
      /* Если компания уже выбрана */
      if ( _.findWhere(selectedCompanies, { id: company.id }) ) {
        /* Удаляем компанию из выбранных */
        selectedCompanies = _.without(selectedCompanies, company);

        /* Снимаем подсветку в списке компаний */
        child.setState({ selected: !child.state.selected });

        /* Изменяем список компаний в state */
        this.setState({ selectedCompanies: selectedCompanies });

        return;
      }

      alert('Вы можете сравнить только ' + this.state.maxCompaniesInGraph + ' компаний');
      return;
    }

    /* Компания уже выбрана */
    if ( _.findWhere(selectedCompanies, { id: company.id }) ) {
      /* Удаляем компанию из выборки */
      selectedCompanies = _.without(selectedCompanies, company);
    }
    /* Добавляем выбранную компанию к выборке */
    else if( selectedCompanies.length <  this.state.maxCompaniesInGraph) {
      selectedCompanies.unshift(company);
    }

    /* Снимаем подсветку в списке компаний */
    child.setState({ selected: !child.state.selected });

    /* Изменяем список компаний в state */
    this.setState({ selectedCompanies: selectedCompanies });
  },

  render: function () {
    return (
      <div className="wrapper container" id="wrapper">
        <h2>Чтобы сравнить метрики, выберите от {this.state.minCompaniesInGraph} до {this.state.maxCompaniesInGraph} компаний из списка</h2>
        <CompaniesPreview
          companies={ this.props.companies }
          selectedCompanies={ this.state.selectedCompanies }
          toggleCompanyFunc={ this.toggleCompanyFunc }
          maxCompaniesInGraph={ this.state.maxCompaniesInGraph }
        />
        <CompaniesGraph
          selectedCompanies={ this.state.selectedCompanies }
          minCompaniesInGraph={ this.state.minCompaniesInGraph }
          maxCompaniesInGraph={ this.state.maxCompaniesInGraph }
        />
      </div>
    );
  }
});

var CompaniesPreview = React.createClass({
  render: function () {
    var selectedCount = this.props.selectedCompanies.length;

    return (
      <div className="aside pull-left" id="companies-list">
        <div className="panel panel-default company-list" id="company-list">
          <CompaniesTable companies={ this.props.companies }
                          toggleCompanyFunc={ this.props.toggleCompanyFunc }
          />
        </div>
      </div>
      )
  }
});

var CompaniesTable = React.createClass({
  render: function() {
    var companyRows = [];

    this.props.companies.forEach( function (company) {
      companyRows.push( <CompaniesItemRow company={company} toggleCompanyFunc={this.props.toggleCompanyFunc} /> );
    }.bind(this) );

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

var CompaniesItemRow = React.createClass({
  getInitialState: function () {
    return {
      selected: false
    }
  },

  onClick: function () {
    this.props.toggleCompanyFunc(this);
  },

  render: function () {
    var className = 'company-item';

    className += ( this.state.selected === true ) ? ' info' : '';

    return (
      <tr className={ className } onClick={ this.onClick }>
        <td>{ this.props.company.id }</td>
        <td>{ this.props.company.title }</td>
      </tr>
    )
  }
});

var SvgComponent = React.createClass({
  render: function () {
    var dataMetrics = this.props.selectedCompanies;

    StreamGraph.render( document.getElementById('company-compare__graph'), dataMetrics );

    return (
      <svg id="company-compare__graph"></svg>
    );
  }
});

var GraphText = React.createClass({
  render: function () {
    var message = 'Пока не выбрано ни одной компании...',
        remain = this.props.maxCompaniesInGraph - this.props.selectedCompanies.length;

    if (this.props.selectedCompanies.length > 0) {
      message = 'Доступно компаний для выбора: ' + remain;
    }

    return (
      <p>{ message }</p>
    )
  }
});

/* Компонента графика */
var CompaniesGraph = React.createClass({
  render: function () {
    var dataMetrics = this.props.selectedCompanies,
        size = dataMetrics.length,
        message = <GraphText maxCompaniesInGraph={ this.props.maxCompaniesInGraph }
                             selectedCompanies={ dataMetrics } />;

    if ( size >= this.props.minCompaniesInGraph ) {
      StreamGraph.render( document.getElementById('company-compare__graph'), dataMetrics );
      $('#company-compare__graph').show();
    }

    else if ( size < this.props.minCompaniesInGraph && $('#company-compare__graph').is(':visible')) {
      $('#company-compare__graph').hide();
    }

    return (
      <div className="content pull-right" id="company-compare">
        <div className="jumbotron">
          { message }
          <svg id="company-compare__graph" className="company-compare__graph"></svg>
        </div>
      </div>
    );
  }
});