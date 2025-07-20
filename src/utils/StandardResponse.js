class Response {
  status;
  data;
  constructor(statusCode, data) {
    this.status = statusCode;
    this.data = data;
  }
}
export default Response;
