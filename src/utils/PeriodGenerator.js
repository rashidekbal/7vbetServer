function generatePeriod30sec() {
  let date = new Date();
  let year = date.getFullYear();
  let month = date.getMonth() + 1;
  let day = date.getDate();
  let hour = date.getHours();
  let min = date.getMinutes() + 1;
  let period = `${year}${month}${day}${hour == 0 ? `00` : hour}${
    min == 0 ? `60` : min < 10 ? "0" + min : min
  }${date.getSeconds() > 30 ? 2 : 1}`;
  return period;
}
function generatePeriod1min() {
  let date = new Date();
  let year = date.getFullYear();
  let month = date.getMonth() + 1;
  let day = date.getDate();
  let hour = date.getHours();
  let min = date.getMinutes() + 1;
  let period = `${year}${month}${day}${hour == 0 ? `00` : hour}${
    min == 0 ? `60` : min < 10 ? "0" + min : min
  }`;
  return period;
}
function generatePeriod3min() {
  let date = new Date();
  let year = date.getFullYear();
  let month = date.getMonth() + 1;
  let day = date.getDate();
  let hour = date.getHours();
  let min = date.getMinutes() + Math.abs((date.getMinutes() % 3) - 3);
  let period = `${year}${month}${day}${hour == 0 ? `00` : hour}${
    min == 0 ? `60` : min < 10 ? "0" + min : min
  }`;
  return period;
}
function generatePeriod5min() {
  let date = new Date();
  let year = date.getFullYear();
  let month = date.getMonth() + 1;
  let day = date.getDate();
  let hour = date.getHours();
  let min = date.getMinutes() + Math.abs((date.getMinutes() % 5) - 5);
  let period = `${year}${month}${day}${hour == 0 ? `00` : hour}${
    min == 0 ? `60` : min < 10 ? "0" + min : min
  }`;
  return period;
}
export {
  generatePeriod30sec,
  generatePeriod1min,
  generatePeriod3min,
  generatePeriod5min,
};
