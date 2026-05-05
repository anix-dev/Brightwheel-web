import { toast } from "react-toastify";

const notifyError = (message: string) => {
    toast.error(message, {
        autoClose: 3000,
    });
};
export default notifyError;