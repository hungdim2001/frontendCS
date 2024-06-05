// ----------------------------------------------------------------------

function path(root: string, sublink: string) {
  return `${root}${sublink}`;
}

const ROOTS_AUTH = '/auth';
const ROOTS_DASHBOARD = '/dashboard';
const ROOTS = '';
// ----------------------------------------------------------------------

export const PATH_AUTH = {
  root: ROOTS_AUTH,
  login: path(ROOTS_AUTH, '/login'),
  loginUnprotected: path(ROOTS_AUTH, '/login-unprotected'),
  register: path(ROOTS_AUTH, '/register'),
  registerUnprotected: path(ROOTS_AUTH, '/register-unprotected'),
  findEmail: path(ROOTS_AUTH, '/find-email'),
  verify: path(ROOTS_AUTH, '/verify'),
  resetPassword: path(ROOTS_AUTH, '/reset-passwrod/:id/:token'),
};

export const PATH_PAGE = {
  comingSoon: '/coming-soon',
  maintenance: '/maintenance',
  pricing: '/pricing',
  payment: '/payment',
  about: '/about-us',
  contact: '/contact-us',
  faqs: '/faqs',
  page404: '/404',
  page500: '/500',
  components: '/components',
};

export const PATH_ROOT = {
  root: ROOTS,
  user: {
    root: path(ROOTS, '/user'),
    profile: path(ROOTS_DASHBOARD, '/user/profile'),
    cards: path(ROOTS_DASHBOARD, '/user/cards'),
    list: path(ROOTS_DASHBOARD, '/user/list'),
    newUser: path(ROOTS_DASHBOARD, '/user/new'),
    editById: path(ROOTS_DASHBOARD, `/user/reece-chung/edit`),
    account: path(ROOTS_DASHBOARD, '/user/account'),
  },
  products: {
    root: path(ROOTS, '/products'),
    list: path(ROOTS, '/products/list'),
    newProduct: path(ROOTS, '/products/new'),
    edit: path(ROOTS, '/products/:id/edit'),
    checkout: path(ROOTS, '/products/checkout'),
  },
  blog: {
    root: path(ROOTS, '/blog'),
  },
  faq: {
    root: path(ROOTS, '/faqs'),
  },
};
export const PATH_DASHBOARD = {
  root: ROOTS_DASHBOARD,
  general: {
    app: path(ROOTS_DASHBOARD, '/app'),
    ecommerce: path(ROOTS_DASHBOARD, '/ecommerce'),
    analytics: path(ROOTS_DASHBOARD, '/analytics'),
    banking: path(ROOTS_DASHBOARD, '/banking'),
    booking: path(ROOTS_DASHBOARD, '/booking'),
  },
  mail: {
    root: path(ROOTS_DASHBOARD, '/mail'),
    all: path(ROOTS_DASHBOARD, '/mail/all'),
  },
  chat: {
    root: path(ROOTS_DASHBOARD, '/chat'),
    new: path(ROOTS_DASHBOARD, '/chat/new'),
    conversation: path(ROOTS_DASHBOARD, '/chat/:conversationKey'),
  },
  calendar: path(ROOTS_DASHBOARD, '/calendar'),
  kanban: path(ROOTS_DASHBOARD, '/kanban'),
  user: {
    root: path(ROOTS_DASHBOARD, '/user'),
    profile: path(ROOTS_DASHBOARD, '/user/profile'),
    cards: path(ROOTS_DASHBOARD, '/user/cards'),
    list: path(ROOTS_DASHBOARD, '/user/list'),
    newUser: path(ROOTS_DASHBOARD, '/user/new'),
    editById: path(ROOTS_DASHBOARD, `/user/reece-chung/edit`),
    account: path(ROOTS_DASHBOARD, '/user/account'),
  },
  product: {
    root: path(ROOTS_DASHBOARD, '/product/list'),
    productTypes: path(ROOTS_DASHBOARD, '/product-type'),
  },
  productChar: {
    root: path(ROOTS_DASHBOARD, '/product-char'),
    list: path(ROOTS_DASHBOARD, '/product-char/list'),
    create: path(ROOTS_DASHBOARD, '/product-char/create'),
    edit: path(ROOTS_DASHBOARD, '/product-char/edit'),
  },
  eCommerce: {
    root: path(ROOTS_DASHBOARD, '/'),
    shop: path(ROOTS_DASHBOARD, '/shop'),
    product: path(ROOTS_DASHBOARD, '/product/:id'),
    // productById: path(ROOTS_DASHBOARD, '/e-commerce/product/nike-air-force-1-ndestrukt'),
    list: path(ROOTS_DASHBOARD, '/list'),
    newProduct: path(ROOTS_DASHBOARD, '/product/new'),
    // editById: path(ROOTS_DASHBOARD, '/e-commerce/product/nike-blazer-low-77-vintage/edit'),
    // checkout: path(ROOTS_DASHBOARD, '/e-commerce/checkout'),
    // invoice: path(ROOTS_DASHBOARD, '/e-commerce/invoice'),
  },
  blog: {
    root: path(ROOTS_DASHBOARD, '/blog'),
    posts: path(ROOTS_DASHBOARD, '/blog/posts'),
    post: path(ROOTS_DASHBOARD, '/blog/post/:title'),
    postById: path(ROOTS_DASHBOARD, '/blog/post/apply-these-7-secret-techniques-to-improve-event'),
    newPost: path(ROOTS_DASHBOARD, '/blog/new-post'),
  },
};

export const PATH_DOCS = 'https://docs-minimals.vercel.app/introduction';
