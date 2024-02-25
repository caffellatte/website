export default () => ({
  salt: parseInt(process.env.SALT ? process.env.SALT : '10', 10),
});
