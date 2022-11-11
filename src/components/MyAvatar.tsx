// hooks
import useAuth from '../hooks/useAuth';
// utils
import createAvatar from '../utils/createAvatar';
//
import Avatar, { Props as AvatarProps } from './Avatar';

// ----------------------------------------------------------------------

export default function MyAvatar({ ...other }: AvatarProps) {
  const { user } = useAuth();

  return (
    <Avatar
      src={user?.avatarUrl??'' }
      alt={user?.fullName??''}
      color={user?.avatarUrl ? 'default' : createAvatar(user?.fullName??'').color}
      {...other}
    >
      {createAvatar(user?.fullName??'').name}
    </Avatar>
  );
}
