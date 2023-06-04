import "./App.css";
import { useState, useEffect } from "react";
import ContentContainer from "./components/ui/ContentContainer";
import Slots from "./components/Slots";
import data from "./components/data/data";
import LastBooking from "./components/LastBooking";
import { Seats } from "./components/Seats";

function App() {
  // initial state for our app for post request
  const [movieData, setmovieData] = useState({
    movie: "",
    timeSlot: "",
    seat: [],
  });

  const [fetchedData, setfetchedData] = useState([]);
  const [resetVal, setResetVal] = useState(false);

  // requiring the data provided by almabetter for our app
  const { movies, slots, seats } = data;

  // this function collects the seats data and updates the state
  const handleSeats = (seatData) => {
    const findSeat = movieData.seat.findIndex(
      (el) => el.seatName === seatData.seatName
    );
    // console.log(`seatData =`);
    // console.log(seatData);
    // console.log(`findseat = ${findSeat}`);

    if (findSeat !== -1) {
      const newSeatData = [...movieData.seat];
      newSeatData[findSeat] = seatData;
      setmovieData((prev) => {
        return {
          ...prev,
          seat: newSeatData,
        };
      });
    } else {
      setmovieData((prev) => {
        return {
          ...prev,
          seat: [...prev.seat, seatData],
        };
      });
    }
    setResetVal(false);
  };

  // this functions tells us to clear the db
  const deleteData = () => {
    fetch(process.env.REACT_APP_REQUESTURL, {
      method: "DELETE",
    })
      // .then((res) => console.log(res))
      .then(() => getData())
      .catch((err) => console.log(err));
  };

  // this function fetches the last booking and update the state for displaying of it
  const getData = async () => {
    return fetch(process.env.REACT_APP_REQUESTURL)
      .then((data) => data.json())
      .then((data) => setfetchedData(data))
      .catch((err) => console.log(err));
  };

  // this function sends the collected state to the db and updates it further gives a response of the last booking
  const handlePost = async (data) => {
    return fetch(process.env.REACT_APP_REQUESTURL, {
      method: "POST",
      body: JSON.stringify(data),
      headers: {
        "Content-type": "application/json; charset=UTF-8",
      },
    })
      .then((res) => {
        return res.json();
      })

      .then((data) => {
        return setfetchedData(data);
      })
      .catch((err) => console.log(err));
  };

  // this will run when the component will mount and update the state ultimately setting up the state to show the last booking
  useEffect(() => {
    getData();
  }, []);

  // these functions updates the state
  const handleMovie = (selectedMovie) => {
    setmovieData((prev) => {
      return {
        ...prev,
        movie: selectedMovie,
      };
    });
  };

  const handleTime = (selectedTime) => {
    setmovieData((prev) => {
      return {
        ...prev,
        timeSlot: selectedTime,
      };
    });
  };
  // ///////////////////////////////////
  // this function handle the submit event which will send data to the server
  const handleSubmit = () => {
    const { movie, seat, timeSlot } = movieData;
    if (movie === "" || timeSlot === "" || seat.length <= 0) {
      alert("Please select every field to continue further");
      return;
    }
    handlePost(movieData);
    setmovieData({
      movie: "",
      timeSlot: "",
      seat: [],
    });
    setResetVal(true);
  };

  return (
    <div className="app-container">
      <div className="app-content">
        <div className="left">
          <ContentContainer label={"Select A Movie"}>
            {movies.map((el, i) => (
              <Slots
                label={el}
                key={i}
                cb={handleMovie}
                movieData={movieData.movie}
              />
            ))}
          </ContentContainer>

          <ContentContainer label={"Select a Time Slot"}>
            {slots.map((el, i) => (
              <Slots
                label={el}
                key={i}
                movieData={movieData.timeSlot}
                cb={handleTime}
              />
            ))}
          </ContentContainer>

          <ContentContainer label={"Select the Seats"}>
            <Seats seats={seats} cb={handleSeats} resetVal={resetVal}/>
          </ContentContainer>

          {/* <div>
            movieData = movie = {movieData.movie}, seat ={" "}
            {movieData.seat.map((item, i) => (
              <span key={i}>{JSON.stringify(item)}, </span>
            ))},
            slot = {movieData.timeSlot},
            resetVal = {resetVal}
          </div> */}
          <div className="submit-btn">
            <button onClick={handleSubmit}>Submit!</button>

            <button onClick={deleteData}>Delete!</button>
          </div>
        </div>
        <div className="right">
          <LastBooking data={fetchedData} />
        </div>
      </div>
    </div>
  );
}

export default App;
