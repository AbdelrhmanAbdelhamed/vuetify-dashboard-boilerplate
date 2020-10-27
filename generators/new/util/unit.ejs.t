---
to: "src/utils/<%= h.changeCase.camel(name) %>/<%= h.changeCase.camel(name) %>.unit.js"
---
<%
  const fileName = h.changeCase.camel(name)
  const importName = h.changeCase.camel(fileName)
%>import <%= importName %> from './<%= fileName %>'

describe('@utils/<%= fileName %>', () => {
  it('says hello', () => {
    const result = <%= importName %>()
    expect(result).toEqual('hello')
  })
})
