import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

const MySwal = withReactContent(Swal);

type AlertType = 'success' | 'error' | 'info' | 'warning';

export const showAlert = async (type: AlertType, message: string, title?: string) => {
  await MySwal.fire({
    icon: type,
    title: title || (type === 'success' ? 'Success' : type === 'error' ? 'Error' : 'Notice'),
    text: message,
    timer: 2000,
    showConfirmButton: false,
  });
};
