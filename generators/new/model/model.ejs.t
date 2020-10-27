---
to: src/api/models/<%= h.changeCase.pascal(h.inflection.singularize(name)) %>Model/<%= h.changeCase.pascal(h.inflection.singularize(name)) %>Model.js
eof_last: false
---
<%
 Name = h.changeCase.pascal(h.inflection.singularize(name))
%>
import BaseModel from '../BaseModel/BaseModel'

/* eslint-disable camelcase */
export default class <%= Name %>Model extends BaseModel {
  static get modelName() {
    return '<%= Name %>'
  }

  constructor(fields = {<% if (hasTranslation) { %> translation: {} <% } %>}) {
    super(fields)
  }

  static modelFieldsMap = {}

  static rawFieldsMap = {}

  static rawParamsMap = {}

}
