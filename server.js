const http = require('http');
const { v4: uuidv4 } = require('uuid');
const errorHandle = require('./errorHandle');
const todos = [
  {
    id: uuidv4(),
    title: 'test1',
  },
];

const requestListener = function (req, res) {
  //設定cors headers
  const headers = {
    'Access-Control-Allow-Headers':
      'Content-Type, Authorization, Content-Length, X-Requested-With',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'PATCH, POST, GET,OPTIONS,DELETE',
    'Content-Type': 'application/json',
  };
  //將用戶傳來req的body資料分割成小chunk
  let body = '';
  req.on('data', (chunk) => {
    body += chunk;
  });

  if (req.url == '/todos' && req.method == 'GET') {
    res.writeHead(200, headers);
    res.write(
      JSON.stringify({
        status: 'Get success',
        data: todos,
      })
    );
    res.end();
  } else if (req.url == '/todos' && req.method == 'POST') {
    req.on('end', () => {
      try {
        //將用戶輸入的資料（body)轉微陣列後即可讀取title
        const title = JSON.parse(body).title;
        if (title !== undefined) {
          //將用戶輸入的代辦訊息const 單一 todo並.push到todos
          const todo = {
            title: title,
            id: uuidv4(),
          };
          todos.push(todo);
          //並寫入data
          res.writeHead(200, headers);
          res.write(
            JSON.stringify({
              status: 'POST success',
              data: todos,
            })
          );
          res.end();
          //body剛傳回來是字串所以要用JSON.parse轉回陣列
          console.log(JSON.parse(body));
        } else {
          errorHandle(res);
        }
      } catch (error) {
        errorHandle(res);
      }
    });
  } else if (req.url == '/todos' && req.method == 'DELETE') {
    todos.length = 0;
    res.writeHead(200, headers);
    res.write(
      JSON.stringify({
        status: 'DELETE success',
        data: todos,
      })
    );
    res.end();
  } else if (req.url.startsWith('/todos/') && req.method == 'DELETE') {
    const id = req.url.split('/').pop();
    const index = todos.findIndex((todo) => todo.id == id);
    console.log(id, index);
    if (index !== -1) {
      todos.splice(index, 1);
      res.writeHead(200, headers);
      res.write(
        JSON.stringify({
          status: 'DELETE by ID success',
          data: todos,
        })
      );
      res.end();
    } else {
      errorHandle(res);
    }
  } else if (req.url.startsWith('/todos/') && req.method == 'PATCH') {
    req.on('end', () => {
      try {
        //將user的title &id 取出
        const todo = JSON.parse(body).title;
        const id = req.url.split('/').pop();
        //比對用戶輸入的id是否跟data內的id有一樣的
        const index = todos.findIndex((todo) => todo.id == id);
        console.log(todo, id);
        if (todo !== undefined && index !== -1) {
          //如果todo有內容且有找到index就更新todos的內容
          todos[index].title = todo;
          res.writeHead(200, headers);
          res.write(
            JSON.stringify({
              status: 'PATCH success',
              data: todos,
            })
          );
          res.end();
        } else {
          errorHandle(res);
        }
      } catch (error) {
        errorHandle(res);
      }
    });
  } else if (req.method == 'OPTIONS') {
    res.writeHead(200, headers);
    res.end();
  } else {
    res.writeHead(404, headers);
    res.write(
      JSON.stringify({
        status: 'false ',
        message: 'not found',
      })
    );
    res.end();
  }
};
const server = http.createServer(requestListener);
server.listen(process.env.PORT || 8000);
//process.env.PORT上傳到render後會自動找到他們的PORT
