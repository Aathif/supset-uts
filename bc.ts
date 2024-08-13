TypeError: Cannot read properties of undefined (reading 'div')

      20 | import { css, styled } from '@superset-ui/core';
      21 |
    > 22 | export const Styles = styled.div`
         |                              ^
      23 |   ${({ theme, isDashboardEditMode }) => css`
      24 |     table.pvtTable {
      25 |       position: ${isDashboardEditMode ? 'inherit' : 'relative'};

      at Object.<anonymous> (plugins/plugin-chart-pivot-table/src/react-pivottable/Styles.js:22:30)
      at Object.<anonymous> (plugins/plugin-chart-pivot-table/src/react-pivottable/TableRenderers.jsx:24:1)
