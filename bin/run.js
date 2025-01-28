const cp = require("child_process");

const renderer =  cp.exec("npm run dev:renderer", (error, stdout, stderr) => {
  console.log(error);
});
const main = cp.exec("npm run dev:main", (error, stdout, stderr) => {
  console.log(error);
});

renderer.stdout.on("data", (data) => {
  console.log(data.toString());
});

main.stdout.on("data", (data) => {
  console.log(data.toString());
});
