---
to: "src/components/<%= h.changeCase.pascal(name) %>/<%= h.changeCase.pascal(name) %>.unit.js"
---
<%
const fileName = importName = h.changeCase.pascal(name)
%>import <%= importName %> from './<%= fileName %>.vue'

describe('@components/<%= fileName %>/<%= fileName %>.vue', () => {
  it('exports a valid component', () => {
    expect(<%= importName %>).toBeAComponent()
  })
})
