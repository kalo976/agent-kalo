import fs from 'node:fs';
import {Config} from '@remotion/cli/config';

Config.setVideoImageFormat('jpeg');
Config.setJpegQuality(95);
Config.setOverwriteOutput(true);
Config.setCodec('h264');
Config.setCrf(16);
Config.setPixelFormat('yuv420p');

// Without a system browser Remotion downloads its own headless Chrome on first render.
const browser = process.env.REMOTION_BROWSER ?? '/usr/bin/chromium';
if (fs.existsSync(browser)) {
  Config.setBrowserExecutable(browser);
  Config.setChromeMode('chrome-for-testing');
}
