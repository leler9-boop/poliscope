/**
 * Module-level router bridge.
 * Lets the Zustand store call react-router's navigate() without hooks.
 */

let _navigate = null;

export function setRouterNavigate(fn) {
  _navigate = fn;
}

export function routerNavigate(path, opts) {
  if (_navigate) _navigate(path, opts);
}

// Maps Zustand page keys → URL paths (static pages)
export const PAGE_TO_PATH = {
  landing:      '/',
  selectTest:   '/test',
  priorities:   '/priorities',
  questionnaire:'/quiz',
  profile:      '/profile',
  elections:    '/elections',
  figures:      '/figures',
  auth:         '/auth',
  mission:      '/mission',
  transparency: '/transparency',
  beginner:     '/learn',
  frenchFigures: '/france',
  // Dynamic — resolved at call time with IDs from store
  electionDetail:   null,
  candidateProfile: null,
  compareView:      null,
};

// Maps URL paths → Zustand page keys (for RouteSync / Header active state)
export const PATH_TO_PAGE = {
  '/':             'landing',
  '/test':         'selectTest',
  '/priorities':   'priorities',
  '/quiz':         'questionnaire',
  '/profile':      'profile',
  '/elections':    'elections',
  '/figures':      'figures',
  '/auth':         'auth',
  '/mission':      'mission',
  '/transparency': 'transparency',
  '/learn':        'beginner',
  '/france':       'frenchFigures',
};
