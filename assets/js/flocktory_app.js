/** @jsx React.DOM */
$.ajax({
  url: 'https://gist.githubusercontent.com/heydiplo/b1296495b5db998f0b4d/raw/afb3efee16797b5fed44966370d0750eb1fe9e46/data.json',
  dataType: 'json',
  success: function (resp) {
    var companies = resp;

    React.renderComponent(<CompaniesStatistics companies={companies} /> , document.getElementById('app') );
  }
});