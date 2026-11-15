import React from "react";
import Ganesh from "./assets/ganesh.webp";
import WeddingPicture from "./assets/Wedimg.webp";
import "./Wedding.css";

const Wedding = () => {
  return (
    <div className="wedding-container">
      {/* Invitation Background */}
      <img
        src={WeddingPicture}
        alt="Wedding Invitation"
        className="wedding-image"
      />

      {/* Ganesh Ji */}
      <img src={Ganesh} alt="Shree Ganesh" className="ganesh-image" />

      {/* Invitation Content */}
      <div className="wedding-content">
        {/* Shree Ganeshaya */}
        <p className="ganesh-text">‖ Shree Ganeshaya Namah ‖</p>

        {/* Introduction */}
        <p className="family-text">
          We solicit your gracious presence on the auspicious occasion of
          <br />
          the wedding celebration of
        </p>

        {/* Person One */}
        <div className="person person-one">
          <h1 className="couple-name">Umang</h1>
          <p className="parent-label">S/O</p>
          <p className="parents">
            Mrs. Rekha Aggarwal
            <br />
            &amp; Mr. Gopal Das Aggarwal
          </p>
        </div>

        {/* With */}
        <div className="and-text">with</div>

        {/* Person Two */}
        <div className="person person-two">
          <h1 className="couple-name">Mansi</h1>
          <p className="parent-label">D/O</p>
          <p className="parents">
            Mrs. Maya Devi
            <br />
            &amp; Mr. Suresh Chand Gupta
          </p>
        </div>
      </div>
    </div>
  );
};

export default Wedding;
