import { View, Text, TextInputProps, TextInput, NativeSyntheticEvent, TextInputChangeEventData } from 'react-native';
import React from 'react';

export type InputProps = { value: string; name: string };

interface Props extends TextInputProps {
  name: string;
  onChangeInput: (inputProps: InputProps) => void;
}

export const Input = ({ name, onChange, onChangeInput, ...props }: Props) => {
  const handleChange = (value: string) => onChangeInput({ value, name });

  return <TextInput onChangeText={handleChange} {...props} />;
};
