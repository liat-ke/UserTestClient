import React from "react";

const TextInput = ({ value, placeHolder, onChangeProp, name, onBlurProp, Id }) => {

    return (
        <input
        type="text"
        value={value}
        placeholder={placeHolder}
        onChange={onChangeProp}
        name={name}
        className={`txt-${name}`}
        onBlur={onBlurProp}
        id={Id}
      />
    );
};

export default TextInput;
