import {
  faCircleCheck,
  faCircleXmark,
  faInfoCircle,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { toast } from "react-toastify";

const TYPES = ["notice", "success", "error"];

const createToast = (message, type) => {
  if (!TYPES.includes(type) || !message) throw new Error("Invalid toast type");

  const icons = {
    notice: faInfoCircle,
    success: faCircleCheck,
    error: faCircleXmark,
  };

  toast(
    <div className="flex flex-col gap-1">
      <div className="text-white text-opacity-50 flex items-center gap-1.5 text-[15px]">
        <FontAwesomeIcon icon={icons[type]} />
        <span className="translate-y-[-1px] capitalize">{type}</span>
      </div>
      <p className="text-white">{message}</p>
    </div>,
    {
      className: `${
        type === "notice" &&
        "!bg-[#004D9490] border-[#0082FB98] hover:!bg-[#004D9450]"
      } ${
        type === "success" &&
        "!bg-[#00940090] border-[#64CE6471] hover:!bg-[#00940050]"
      } ${
        type === "error" &&
        "!bg-[#8A120C90] border-[#F1332271] hover:!bg-[#8A120C50]"
      } cursor-pointer border-2 px-2 py-[5px] transition-colors duration-150 backdrop-blur-[16px]`,
    }
  );
};

export default createToast;
