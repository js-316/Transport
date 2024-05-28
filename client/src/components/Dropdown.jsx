import React, { useState } from "react";

const DropdownMenu = () => {
  // State to manage the visibility of the dropdown menu
  const [isOpen, setIsOpen] = useState(false);

  // Function to toggle the visibility of the dropdown menu
  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  // Function to handle selection of an item in the dropdown menu
  const handleItemClick = (item) => {
    // You can perform any action here based on the selected item
    console.log(`Selected item: ${item}`);
    // For simplicity, let's just close the dropdown menu
    setIsOpen(false);
  };

  return (
    <i className="dropdown">
      {/* Button to toggle the dropdown menu */}
      <button className="dropdown-toggle" onClick={toggleMenu}>
        Toggle Dropdown
      </button>

      {/* Dropdown menu */}
      {isOpen && (
        <ul className="dropdown-menu">
          <li onClick={() => handleItemClick("Item 1")}>Item 1</li>
          <li onClick={() => handleItemClick("Item 2")}>Item 2</li>
          <li onClick={() => handleItemClick("Item 3")}>Item 3</li>
        </ul>
      )}
    </i>
  );
};

export default DropdownMenu;
