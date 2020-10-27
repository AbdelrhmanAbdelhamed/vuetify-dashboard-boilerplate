---
to: src/state/mutation-types.js
inject: true
skip_if: // <%= h.changeCase.camel(h.inflection.pluralize(name)) %>
append: true
eof_last: false
---
<%
 NAME = h.changeCase.constant(h.inflection.singularize(name))
 NAMES = h.changeCase.constant(h.inflection.pluralize(name))
 names = h.changeCase.camel(h.inflection.pluralize(name))
%>
// ===
// <%= names %>
// ===
export const SET_<%= NAMES %> = 'SET_<%= NAMES %>'
<% if (includeResetStateAction) { %>export const RESET_<%= NAMES %> = 'RESET_<%= NAMES %>' <% } %>
export const ADD_<%= NAME %> = 'ADD_<%= NAME %>'
export const UPDATE_<%= NAME %> = 'UPDATE_<%= NAME %>'
export const REMOVE_<%= NAME %> = 'REMOVE_<%= NAME %>'
