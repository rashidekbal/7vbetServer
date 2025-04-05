function get_up_to_to_digits_decimal(x) {
  return parseFloat(x.toFixed(2));
}
function generateFlight(x) {
  let temp = Math.random() * x;
  let result = get_up_to_to_digits_decimal(temp < 1 ? 1.0 + temp : temp);
  return result;
}
function fly_the_bird(result, socket) {
  console.log(result);
  let initial_height = 1.0;
  let final_height = initial_height;

  let flight_controller = setInterval(() => {
    if (get_up_to_to_digits_decimal(final_height) == result) {
      clearInterval(flight_controller);
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
  let currentSec = 0;
  let Running_interval = setInterval(() => {
    if (currentSec == 10) {
      clearInterval(Running_interval);
      fly_the_bird(result, socket);
    }
    if (currentSec < 10) {
      currentSec++;
      console.log(Math.abs(currentSec - 10));
      socket.emit("Aviator_halt", {
        remaining_time: Math.abs(currentSec - 10),
      });
    }
  }, 1000);
}
export default start_new_game;
