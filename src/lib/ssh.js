var Client = require('ssh2').Client;

module.exports = {
  test: () => {
    return asyncPromiseWithConnection(async(conn) => {
      await conn.execStdout('sudo docker ps');
    });
  },
  deploy: () => {
    return asyncPromiseWithConnection(async(conn) => {
      await conn.execStream('cd latour*; git remote -v; git pull origin master;');
      await conn.execStream('cd latour*; cd server_api; sudo docker-compose restart');
      conn.end();
    });
  },
  deployHard: (onStream) => {
    return asyncPromiseWithConnection(async(conn) => {
      if (!onStream) {
        await conn.execStream('cd latour*; git remote -v; git pull origin master;');
        await conn.execStream('cd latour*; cd server_api; sudo docker-compose stop');
        await conn.execStream('cd latour*; cd server_api; sudo docker-compose build');
        await conn.execStream('cd latour*; cd server_api; sudo docker-compose up -d');
        console.log('Deploy completed');
      } else {
        await conn.exec('cd latour*; git remote -v; git pull origin master;', onStream);
        await conn.exec('cd latour*; cd server_api; sudo docker-compose stop', onStream);
        await conn.exec('cd latour*; cd server_api; sudo docker-compose build', onStream);
        await conn.exec('cd latour*; cd server_api; sudo docker-compose up -d', onStream);
      }
      conn.end();
    });
  },
  logs: (onStream) => {
    return asyncPromiseWithConnection(async(conn) => {
      if (onStream) {
        await conn.exec('cd latour*; cd server_api; sudo docker-compose logs;', onStream);
      } else {
        await conn.execStream('cd latour*; cd server_api; sudo docker-compose logs;');
      }
      conn.end();
    }, onStream ? true : false);
  }
};

function asyncPromiseWithConnection(handler, keepAlive) {
  return asyncPromise(async() => {
    await validateCredentials();
    let conn = await getConnection();
    await handler(conn);
    if (!keepAlive) {
      process.exit(0);
    }
  });
}

function asyncPromise(handler) {
  return new Promise((resolve, reject) => handler().then(resolve).catch(reject));
}

async function getConnection() {
  return new Promise((resolve, reject) => {
    var conn = new Client();
    conn.on('ready', function() {

      let scope = {
        exec: (command, onStream) => {
          return new Promise((resolve, reject) => {
            conn.exec(command, function(err, stream) {
              if (err) throw err;
              let result = '';
              stream.on('close', function(code, signal) {
                resolve(result + ` 
CODE:${code} SIGNAL:${signal}`);
              }).on('data', function(data) {
                result += data.toString("utf-8");
                onStream && onStream(data.toString("utf-8"));
              }).stderr.on('data', function(data) {
                result += data.toString("utf-8");
                onStream && onStream(data.toString("utf-8"));
              });
            });
          })
        }
      };
      scope.end = () => conn.end();
      scope.execStdout = async(cmd, onStream) => {
        console.log(await scope.exec(cmd, onStream));
      };
      scope.execStream = async(cmd) => {
        await scope.exec(cmd, (data) => {
          console.log(data.toString('utf-8'));
        });
      };
      scope.wait = (seconds) => {
        return new Promise((resolve, reject) => {
          setTimeout(() => resolve(), seconds * 1000);
        });
      };
      scope.shell = (exec) => {
        return new Promise((resolve, reject) => {
          conn.shell(function(err, stream) {
            if (err) throw err;
            stream.on('close', function() {
              conn.end();
              resolve();
            }).on('data', function(data) {
              console.log(data.toString('utf-8'));
            }).stderr.on('data', function(data) {
              console.log(data.toString('utf-8'));
            });
            exec((command) => {
              stream.write(command + '\n');
            });
            stream.end('\nexit\n');
          });
        });
      }

      resolve(scope);
    }).connect({
      host: process.env.SSH_ADDRESS,
      port: process.env.SSH_PORT || 22,
      username: process.env.SSH_USERNAME,
      privateKey: require('fs').readFileSync(process.cwd() + '/' + process.env.SSH_PRIVATE_KEY),
      passphrase: process.env.SSH_PASSPHRASE
    });
  });
}

async function validateCredentials() {
  if (!process.env.SSH_ADDRESS) throw new Error('SSH_ADDRESS required');
  if (!process.env.SSH_USERNAME) throw new Error('SSH_USERNAME required');
  if (!process.env.SSH_PRIVATE_KEY) throw new Error('SSH_PRIVATE_KEY required');
  if (!process.env.SSH_PASSPHRASE) throw new Error('SSH_PASSPHRASE required');
}