import { Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import Iconify from "src/components/Iconify";
import useAuth from "src/hooks/useAuth";
import { PATH_AUTH } from "src/routes/paths";

export default function BackVerifyFromButton() {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const handleOnClick =  async () => {
    try {
      await logout();
      navigate(PATH_AUTH.login, { replace: true });
    } catch (error) {
      console.error(error);
    }
  }
  return (
    <Button
      size="small"
      onClick={handleOnClick}
      startIcon={<Iconify icon={'eva:arrow-ios-back-fill'} width={20} height={20} />}
      sx={{ mb: 3 }}
    >
      Đăng xuất
    </Button>
  );
}
