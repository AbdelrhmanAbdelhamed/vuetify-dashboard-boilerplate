---
to: "src/utils/<%= h.changeCase.camel(name) %>.js"
---
<%
  const fileName = h.changeCase.camel(name)
  const importName = h.changeCase.camel(fileName)
%>export default function <%= importName %>() {
  return 'hello'
}
