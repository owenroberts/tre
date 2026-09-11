import { Animator, Easings } from './animator';
import { Joint } from './joint';
import { BandShader } from './post/band-shader';
import { LinesPass } from './post/lines-pass';
import vertexShader from './glsl/simple_vert.glsl';
import blendShader from './glsl/blend.glsl';

import { addLine, addTubeLine, mat, addRandomLine } from './utils';

import { Bird } from './fauna/bird';
import { Flock, BIRD_FLOCK_CONFIG, WORM_FLOCK_CONFIG } from './fauna/flock';
import { FlockMember } from './fauna/flock-member';
import { Follower } from './fauna/follower';

import { GeoCat } from './fauna/geo-cat';
import { GeoPig } from './fauna/geo-pig';
import { ModelCat } from './fauna/model-cat';
import { Worm } from './fauna/worm';
import { Singer } from './fauna/singer';

export { Animator, Easings, Joint, BandShader, LinesPass, vertexShader, blendShader, Bird, Flock, FlockMember, Follower, BIRD_FLOCK_CONFIG, WORM_FLOCK_CONFIG, addLine, GeoCat, ModelCat, GeoPig, addTubeLine, addRandomLine, Worm, Singer };