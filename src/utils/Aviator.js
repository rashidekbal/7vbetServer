let period;
let initial_height;
let final_height;
function generator_period() {
  let date = new Date();
  let year = date.getFullYear();
  let month = date.getMonth() + 1;
  let day = date.getDate();
  let hour = date.getHours();
  let min = date.getMinutes() + 1;
  let sec = date.getSeconds();
  // generate new random int between 0 and 9
  let period = `${year}${month}${day}${hour == 0 ? `00` : hour}${
    min == 0 ? `60` : min < 10 ? "0" + min : min
  }${sec}`;
  return period;
}

function get_up_to_to_digits_decimal(x) {
  return parseFloat(x.toFixed(2));
}
function generateFlight(x) {
  let temp = Math.random() * x;
  let result = get_up_to_to_digits_decimal(temp < 1 ? 1.0 + temp : temp);
  return result;
}
function fly_the_bird(result, socket) {
  initial_height = 1.0;
  final_height = initial_height;

  let flight_controller = setInterval(() => {
    if (get_up_to_to_digits_decimal(final_height) == result) {
      clearInterval(flight_controller);
      socket.emit("Game_over", {
        msg: true,
      });
      start_new_game(socket);
    } else {
      final_height = get_up_to_to_digits_decimal(final_height + 0.01);
      socket.emit("Flight_data", {
        Height: final_height,
      });
    }
  }, 48);
  socket.on("test", (data) => {
    console.log(data);
  });
}
function start_new_game(socket) {
  let result = generateFlight(4);
  period = generator_period();

  let currentSec = 0;
  setTimeout(() => {
    let Running_interval = setInterval(() => {
      if (currentSec == 10) {
        clearInterval(Running_interval);
        fly_the_bird(result, socket);
      }
      if (currentSec < 10) {
        currentSec++;
        socket.emit("Aviator_halt", {
          remaining_time: Math.abs(currentSec - 10),
        });
        socket.emit("period", { period: period });
      }
    }, 1000);
  }, 1000);
}
export default start_new_game;
