---
to: src/api/models/index.js
inject: true
skip_if: <%= h.changeCase.pascal(h.inflection.singularize(name)) %>Model,
after: "export {"
eof_last: false
---
<%
 Name = h.changeCase.pascal(h.inflection.singularize(name))
%>
<%= Name %>Model,
