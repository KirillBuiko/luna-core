const spawn = require("child_process").spawn
const platform = require("os").platform()
const args = process.argv.slice(2);
const cmd = ["ts-node", ...args];

console.log(cmd, platform);
const proc = spawn(cmd[0], cmd.slice(1), {
    stdio: "inherit",
    env: {
        TS_NODE_BASEURL: "./dist"
    }
});

proc.on('close', (code) => {
    process.exit(code);
});
