import React, { useEffect, useRef, useState } from "react";
import { TransactionContext } from "../../context/TransactionContext";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { MuiOtpInput } from "mui-one-time-password-input";
import axios from "axios";
import Circler from "../Circler";
import { shortenAddress } from "../../utils/shortenAddress";
import Loader from "../Loader";
import { initTransaction } from "../../lib/instance";

const items = [
  { name: "Demo: Age Verification" },
  { name: "Demo: Hotel Verification" },
];

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  height: 200,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
  borderRadius: "10px",
};

const Dropdown = ({ setDropdown }) => {
  const ref = useRef(null);
  const [selectedItem, setSelectedItem] = useState(null);
  const {modalLoading,setModalLoading} = useContext(TransactionContext);

  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const [otp, setOtp] = useState("");


  const handleOtpChange = (newValue) => {
    setOtp(newValue);
  };

  const startTransaction = async () => {
    setModalLoading(true);
    try {
      const response = await axios.get("http://localhost:4000/retrieve");
      setNfcResponse(response.data);
    } catch (err) {
      console.error(err);
    } finally {
      setModalLoading(false);
    }
  };

  const handleModal = (e) => {
    e.preventDefault();
    setOpen(true);
    startTransaction();
  };



  const handleClickOutside = (event) => {
    if (ref.current && !ref.current.parentNode?.contains(event.target)) {
      setDropdown(false);
    }
  };

  useEffect(() => {
    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  const handleItemClick = (itemName) => {
    setSelectedItem(itemName === selectedItem ? null : itemName);
  };

  return (
    <ul
      ref={ref}
      className="w-full bg-transparent border-2 text-gray-600 shadow-md rounded-md border-gray-500 p-2"
    >
      {items.map((item, index) => (
        <label
          key={index}
          className={`flex items-center w-full px-2 py-1 gap-2 text-sm font-semibold transition-colors duration-150 rounded-md hover:bg-transparent hover:text-white ${
            selectedItem === item.name ? "bg-gray-600 text-white" : ""
          }`}
          onClick={() => handleItemClick(item.name)}
        >
          <input
            type="radio"
            value={item.name}
            checked={selectedItem === item.name}
            onChange={() => {}}
          />
          {item.name}
        </label>
      ))}


    </ul>
  );
};

export default Dropdown;
