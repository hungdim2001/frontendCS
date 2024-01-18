import  { ReactNode } from 'react';
import PropTypes from 'prop-types';
import { Box, BoxProps, styled } from '@mui/material';
// import GoogleMapReact from 'google-map-react';


const RootStyle = styled(Box)({
});
styled
interface Props extends BoxProps {
    children: ReactNode;
  }
const GoogleMap = ({ children, ...props }: Props) => (
  <RootStyle>
    {/* <GoogleMapReact
      bootstrapURLKeys={{
        key: process.env.REACT_APP_MAP_KEY,
      }}
      {...props}
    >
      {children}
    </GoogleMapReact> */}
  </RootStyle>
);

GoogleMap.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.node,
    PropTypes.arrayOf(PropTypes.node),
  ]),
};

GoogleMap.defaultProps = {
  children: null,
};

export default GoogleMap;
