// routes
import { PATH_AUTH, PATH_DOCS, PATH_PAGE } from '../../routes/paths';
// components
import { PATH_AFTER_LOGIN } from '../../config';
// components
import Iconify from '../../components/Iconify';
import { useEffect } from 'react';
import { useDispatch } from 'src/redux/store';
import { getProductTypes } from 'src/redux/slices/product-type';

// ----------------------------------------------------------------------

const ICON_SIZE = {
  width: 22,
  height: 22,
};

const menuConfig = [
  {
    title: 'Home',
    path: '/',
  },
  {
    title: 'Blogs',
    path: '/blog',
  },
  {
    title: 'FAQ',
    path: '/faqs',
  },
  {
    title: 'Contac Us',
    path: '/contact-us',
  },
 
];

export default menuConfig;
