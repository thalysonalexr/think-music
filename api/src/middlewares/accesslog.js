import AccessLog from '../data/AccessLog';

const AccessLogMiddleware = async (req, res, next) => {
  const date = Date.now();
  const host = `${req.protocol}://${req.host}`;
  const { ip } = req.ipInfo;
  const browser = req.useragent.source;
  const { method } = req;
  const uri = req.originalUrl;
  const http = req.httpVersion;

  await AccessLog.create({ date, host, ip, browser, method, uri, http })

  return next();
}

export default AccessLogMiddleware;