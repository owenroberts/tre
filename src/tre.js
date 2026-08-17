import { Animator, Easings } from './animator';
import { Joint } from './joint';
import { BandShader } from './post/band-shader';
import { LinesPass } from './post/lines-pass';
import vertexShader from './glsl/simple_vert.glsl';
import blendShader from './glsl/blend.glsl';
import { getArrowHelper, getTestCube, getAxesHelper } from './helpers.js';
import { Bird } from './fauna/bird';
import { Flock, BIRD_FLOCK_CONFIG } from './fauna/flock';
import { FlockMember } from './fauna/flock-member';
import { Follower } from './fauna/follower.js';

export { Animator, Easings, Joint, BandShader, LinesPass, vertexShader, blendShader, getArrowHelper, getTestCube, getAxesHelper, Bird, Flock, FlockMember, Follower, BIRD_FLOCK_CONFIG };