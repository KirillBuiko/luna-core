$env:TS_NODE_BASEURL="./dist"
node -r tsconfig-paths/register $args[0]
