import { toast } from "react-toastify";

const notifySuccess = (message: string) => {
    toast.success(message, {
        autoClose: 3000,
    });
};
export default notifySuccess;