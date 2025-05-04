import React from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";

function Input({ label, state, setState, placeholder, type, icon }) {
  return (
    <div className="input-wrapper">
      <p className="label-input">{label}</p>
      <div className="input-field-with-icon">
        <input
          type={type}
          value={state}
          placeholder={placeholder}
          onChange={(e) => setState(e.target.value)}
          className="custom-input"
        />
        {icon && <span className="input-icon">{icon}</span>}
      </div>
    </div>
  );
}

export default Input;
