var Flocktory = new Marionette.Application();

Flocktory.addRegions({
  listRegion:    '.company-list-region',
  compareRegion: '.company-compare-region'
});


Flocktory.addInitializer(function () {
  var fetchingCompanies = Flocktory.request('company:entities');

  /* Показать список */
  $.when( fetchingCompanies).done( function (companies) {
    var listView = new Flocktory.Views.CompanyList({ collection: companies, show: 5});

    Flocktory.listRegion.show( listView );
  });
});