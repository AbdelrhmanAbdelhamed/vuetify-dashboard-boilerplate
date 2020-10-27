---
to: src/api/models/index.js
inject: true
skip_if: import <%= h.changeCase.pascal(h.inflection.singularize(name)) %>Model from './<%= Name %>Model/<%= Name %>Model'
before: "import"
eof_last: false
---
<%
 Name = h.changeCase.pascal(h.inflection.singularize(name))
%>
import <%= Name %>Model from './<%= Name %>Model/<%= Name %>Model'
