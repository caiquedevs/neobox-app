import React from 'react';
import { ShowIf } from './ShowIf';
import { Path, Rect, Svg } from 'react-native-svg';
import { ImageProps, Image as RNImage } from 'react-native';

interface Props extends ImageProps {
  uri: string | undefined;
  imgClass: string;
}

export function Image({ uri, style, source, imgClass, ...props }: Props) {
  return (
    <>
      <ShowIf show={!uri} className="overflow-hidden">
        <Svg viewBox="0 0 32 32" fill="none">
          <Rect width="32" height="32" fill="#AFB3BF" />
          <Path
            d="M9 25C8.45 25 7.979 24.804 7.587 24.412C7.195 24.02 6.99934 23.5493 7 23V9C7 8.45 7.196 7.979 7.588 7.587C7.98 7.195 8.45067 6.99934 9 7H23C23.55 7 24.021 7.196 24.413 7.588C24.805 7.98 25.0007 8.45067 25 9V23C25 23.55 24.804 24.021 24.412 24.413C24.02 24.805 23.5493 25.0007 23 25H9ZM10 21H22L18.25 16L15.25 20L13 17L10 21Z"
            fill="#fff"
          />
        </Svg>
      </ShowIf>

      <ShowIf show={uri}>
        <RNImage {...props} style={{ objectFit: 'scale-down' }} source={{ uri }} className={imgClass} />
      </ShowIf>
    </>
  );
}
