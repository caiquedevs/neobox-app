import React, { HTMLAttributes } from 'react';
import { View, ViewProps } from 'react-native';

interface Props extends ViewProps {
  children?: any;
  show: boolean | string | number | File | undefined | null;
}

export function ShowIf({ show, children, ...props }: Props) {
  if (!show) return null;
  return <View {...props}>{children ? children : null}</View>;
}
