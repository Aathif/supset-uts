import React from 'react';
import { getNumberFormatter, t, tn } from '@superset-ui/core';

import Label from 'src/components/Label';
import { Tooltip } from 'src/components/Tooltip';

type RowCountLabelProps = {
  rowcount?: number;
  limit?: number;
  loading?: boolean;
};

const limitReachedMsg = t(
  'The row limit set for the chart was reached. The chart may show partial data.',
);

export default function RowCountLabel(props: RowCountLabelProps) {
  const { rowcount = 0, limit = null, loading } = props;
  const limitReached = limit && rowcount >= limit;
  const type =
    limitReached || (rowcount === 0 && !loading) ? 'danger' : 'default';
  const formattedRowCount = getNumberFormatter()(rowcount);
  const label = (
    <Label type={type}>
      {loading ? (
        t('Loading...')
      ) : (
        <span data-test="row-count-label">
          {tn('%s row', '%s rows', rowcount, formattedRowCount)}
        </span>
      )}
    </Label>
  );
  return limitReached ? (
    <Tooltip id="tt-rowcount-tooltip" title={<span>{limitReachedMsg}</span>}>
      {label}
    </Tooltip>
  ) : (
    label
  );
}
