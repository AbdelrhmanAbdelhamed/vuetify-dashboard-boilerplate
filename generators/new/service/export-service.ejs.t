---
to: src/api/services/index.js
inject: true
skip_if: export const <%= h.changeCase.camel(h.inflection.pluralize(name)) %>Service = new <%= h.changeCase.pascal(h.inflection.pluralize(name)) %>Service()
before: "export"
eof_last: false
---
<%
 names = h.changeCase.camel(h.inflection.pluralize(name))
 Names = h.changeCase.pascal(h.inflection.pluralize(name))
%>
export const <%= names %>Service = new <%= Names %>Service()
