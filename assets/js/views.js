Flocktory.module('Views', function (Views, Flocktory, Backbone, Marionette, $, _) {

  Views.Company = Marionette.ItemView.extend({
    tagName: 'tr',

    template: _.template('<td><%- id %></td>\
      <td><%- title %></td>\
      <td class="text-center"><%- metrics.offers %></td>\
      <td class="text-center"><%- metrics.shares %></td>\
      <td class="text-center"><%- metrics.landings %></td>\
      <td class="text-center"><%- metrics.leads %></td>\
      <td class="text-center"><%- metrics.purchases %></td>\
      <td class="text-center"><%- metrics.friends %></td>')
  });

  Views.CompanyList = Marionette.CompositeView.extend({
    childView: Views.Company,

    childViewContainer: '.company-list',

    template: _.template('<h3>Companies</h3>\
    <table class="table table-striped">\
      <tr>\
        <th>#</th>\
        <th>title</th>\
        <th class="text-center">offers</th>\
        <th class="text-center">shares</th>\
        <th class="text-center">landings</th>\
        <th class="text-center">leads</th>\
        <th class="text-center">purchases</th>\
        <th class="text-center">friends</th>\
      </tr>\
    <tbody class="company-list"></tbody>\
    </table>')
  });
});