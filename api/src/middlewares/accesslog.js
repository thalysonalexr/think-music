import AccessLog from '../data/AccessLog';

export const accessLogMiddleware = async (req, res, next) => {
  const date = Date.now();
  const host = `${req.protocol}://${req.host}`;
  const { ip } = req.ipInfo;
  const browser = req.useragent.source;
  const { method } = req;
  const uri = req.originalUrl;
  const http = req.httpVersion;
  
  try {
    await AccessLog.create({ date, host, ip, browser, method, uri, http })
    return next();
  } catch (err) {
    return res.status(503).json({
      error: 503,
      message: 'Service Unavailable'
    });
  }
}

export const showLogsMiddleware = async (req, res) => {
  const { page = 1 } = req.query;

  try {
    const logs = await AccessLog.paginate({}, { page, limit: 20 });
    return res.status(200).json(logs);
  } catch (err) {
    return res.status(503).json({
      error: 503,
      message: 'Service Unavailable'
    });
  }
}
