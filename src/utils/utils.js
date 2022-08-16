
// 쿼리 결과용 데이터셋
exports.dataSet = new function() {
  this.value = {};
  this.code = "";
  this.message = "";
};

exports.getNow = new function() {
  return Date.now();
}

exports.getAddTime = async (time) => {
  let timestamp;
  if (Number(time)=== 0) {
    timestamp = Date.now() + 1000 * 60 * 60
  }
  timestamp = Date.now() + 1000 * 60 * 60 * Number(time);
  console.log(timestamp);
  return timestamp;
}

exports.getAddDay = async (day) => {
  let timestamp;
  if (Number(day)=== 0) {
    timestamp = Date.now() + 1000 * 60 * 60 * 24
  }
  timestamp = Date.now() + 1000 * 60 * 60 * 24 * Number(day);
  console.log(timestamp);
  return timestamp;
}



