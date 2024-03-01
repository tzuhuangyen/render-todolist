function errorHandle(res) {
  //設定cors headers
  const headers = {
    'Access-Control-Allow-Headers':
      'Content-Type, Authorization, Content-Length, X-Requested-With',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'PATCH, POST, GET,OPTIONS,DELETE',
    'Content-Type': 'application/json',
  };
  res.writeHead(400, headers);
  res.write(
    JSON.stringify({
      status: 'false',
      massage: 'please enter something or no found ',
    })
  );
  res.end();
}
module.exports = errorHandle;
