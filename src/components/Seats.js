import React from "react";
import { SeatSlot } from "./SeatSlot";

export const Seats = ({ seats, cb, resetVal }) => {
  return (
    <div style={{ display: "flex", flexWrap: "wrap" }}>
      {seats.map((el, i) => (
        <SeatSlot seatName={el} key={i} cb={cb} resetVal={resetVal} />
      ))}
    </div>
  );
};
