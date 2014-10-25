Flocktory.module('Entities', function (Entities, Flocktory, Backbone, Marionette, $, _) {
  Entities.Company = Backbone.Model.extend({
    getMetric: function (name) {
      var metrics = this.get('metrics');

      return metrics[name];
    }
  });

  Entities.CompanyList = Backbone.Collection.extend({
    url: 'https://gist.githubusercontent.com/heydiplo/b1296495b5db998f0b4d/raw/afb3efee16797b5fed44966370d0750eb1fe9e46/data.json?limit=9',

    model: Entities.Company
  });

  Flocktory.reqres.setHandler('company:entities', function () {
    var defer = $.Deferred(),
      companies = new Entities.CompanyList();

    companies.fetch({
      success: function (data) {
        defer.resolve( data );
      },
      error: function () {
        defer.resolve( undefined );
      }
    });

    return defer.promise();
  });
});