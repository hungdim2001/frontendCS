import { IconButton, Link, Tooltip } from "@mui/material";
import { useSnackbar } from "notistack";
import { styled } from '@mui/material/styles';
import { authApi } from "src/service/app-apis/auth";
const AtagStyle = styled('a')(({ theme }) => ({
    cursor: 'pointer'
}));
export default function ReSendCodeButton() {
    const { enqueueSnackbar } = useSnackbar();
    const handleReSendCode = async () => {
        try {
            await authApi.reSendCode();
            enqueueSnackbar('A new code has been sent to your mailbox');

        } catch (error) {
            console.error(error);
            // enqueueSnackbar('Unable to logout!', { variant: 'error' });
        }
    }
    return (
        // <AtagStyle>
            <Link variant="subtitle2" underline="none"  onClick={handleReSendCode}>
                Resend code
            </Link>
        // </AtagStyle>
    );

}
