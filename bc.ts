import React from 'react';
import { useTheme } from '@superset-ui/core';
import { List, ListItemProps } from 'src/components';

export interface CustomListItemProps extends ListItemProps {
  selectable: boolean;
}

export default function CustomListItem(props: CustomListItemProps) {
  const { selectable, children, ...rest } = props;
  const theme = useTheme();
  const css = {
    '&.ant-list-item': {
      padding: `${(theme?.gridUnit || 4) + 2}px ${(theme?.gridUnit || 4) * 3}px`,
      ':first-of-type': {
        borderTopLeftRadius: (theme?.gridUnit || 4),
        borderTopRightRadius: (theme?.gridUnit || 4),
      },
      ':last-of-type': {
        borderBottomLeftRadius: (theme?.gridUnit || 4),
        borderBottomRightRadius: (theme?.gridUnit || 4),
      },
    },
  };

  if (selectable) {
    css['&:hover'] = {
      cursor: 'pointer',
      backgroundColor: (theme?.colors?.grayscale?.light4 || '#F7F7F7'),
    };
  }

  return (
    <List.Item {...rest} css={css}>
      {children}
    </List.Item>
  );
}
