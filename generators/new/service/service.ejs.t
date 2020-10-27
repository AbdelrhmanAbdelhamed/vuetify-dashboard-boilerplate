---
to: src/api/services/<%= h.changeCase.pascal(h.inflection.pluralize(name)) %>Service/<%= h.changeCase.pascal(h.inflection.pluralize(name)) %>Service.js
eof_last: false
---
<%
 names = h.changeCase.camel(h.inflection.pluralize(name))
 Name = h.changeCase.pascal(h.inflection.singularize(name))
 Names = h.changeCase.pascal(h.inflection.pluralize(name))
%>
import BaseService from '../BaseService/BaseService'

import <%= Name %> from '../../models/<%= Name %>Model/<%= Name %>Model'

export default class <%= Names %>Service extends BaseService {
<% if (endPointSearchPostfix) { %>
  get endPointSearchPostfix() {
    return '<%= endPointSearchPostfix %>'
  }
<% } %>
  get resource() {
    return '<%= names %>'
  }

  get Model() {
    return <%= Name %>
  }

}
