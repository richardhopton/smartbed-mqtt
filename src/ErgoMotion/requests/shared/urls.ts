export const urls = () => {
  const host = 'api2.xlink.cn';
  const userBaseUrl = `http://${host}/v2/user`;
  const authRequestUrl = `${userBaseUrl}_auth`;

  return {
    host,
    authRequestUrl,
    userBaseUrl,
  };
};
