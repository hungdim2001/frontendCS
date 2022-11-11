import { useContext } from 'react';
import { LocationContext } from 'src/contexts/LocationContext';

// ----------------------------------------------------------------------

const useLocationContext = () => useContext(LocationContext);

export default useLocationContext;
