---
to: src/api/services/index.js
inject: true
skip_if: import <%= h.changeCase.pascal(h.inflection.pluralize(name)) %>Service from './<%= h.changeCase.pascal(h.inflection.pluralize(name)) %>Service/<%= h.changeCase.pascal(h.inflection.pluralize(name)) %>Service'
before: "import"
eof_last: false
---
<%
 Names = h.changeCase.pascal(h.inflection.pluralize(name))
%>
import <%= Names %>Service from './<%= Names %>Service/<%= Names %>Service'
