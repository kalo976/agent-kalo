import {useEffect, useState} from 'react';
import {continueRender, delayRender} from 'remotion';

export const useFonts = () => {
  const [handle] = useState(() => delayRender('fonts'));
  useEffect(() => {
    Promise.all([
      document.fonts.load('400 100px "Instrument Serif"'),
      document.fonts.load('italic 400 100px "Instrument Serif"'),
      document.fonts.load('400 20px "JetBrains Mono"'),
      document.fonts.load('600 20px "JetBrains Mono"'),
      document.fonts.load('400 20px "Inter Variable"'),
    ]).then(() => continueRender(handle));
  }, [handle]);
};
