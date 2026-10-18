import {registerRoot, Composition} from 'remotion';
import {Planche} from './Planche';
const Root = () => <Composition id="Planche" component={Planche} durationInFrames={540} fps={30} width={1080} height={1920} />;
registerRoot(Root);
