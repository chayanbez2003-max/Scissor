import UAParser from 'ua-parser-js';
import Analytics from '../models/analytics.model.js';
import Url from '../models/url.model.js';

/**
 * Records click details asynchronously to avoid delaying redirection.
 * Parses user agent and details, updates cumulative click counters.
 */
export const recordClick = async (urlDocument, req) => {
  try {
    const userAgentString = req.headers['user-agent'] || '';
    const referrer = req.headers['referer'] || req.headers['referrer'] || 'Direct';
    
    // Attempt to parse IP address from headers
    const ipAddress = req.headers['x-forwarded-for'] || req.socket.remoteAddress || 'Anonymous';

    // Parse User Agent
    const parser = new UAParser(userAgentString);
    const browserResult = parser.getBrowser();
    const osResult = parser.getOS();
    const deviceResult = parser.getDevice();

    // Map browser, OS, and device values
    const browser = browserResult.name ? `${browserResult.name} ${browserResult.version || ''}`.trim() : 'Unknown';
    const os = osResult.name ? `${osResult.name} ${osResult.version || ''}`.trim() : 'Unknown';
    
    let device = 'Desktop'; // Default to desktop if parsing is inconclusive
    if (deviceResult.type === 'mobile') {
      device = 'Mobile';
    } else if (deviceResult.type === 'tablet') {
      device = 'Tablet';
    } else if (userAgentString.toLowerCase().includes('mobile')) {
      device = 'Mobile';
    }

    // Save Analytics Event
    const analyticsEvent = new Analytics({
      urlId: urlDocument._id,
      ipAddress: ipAddress.split(',')[0].trim(), // Take first IP if proxy lists are present
      userAgent: userAgentString,
      device,
      browser,
      os,
      referrer,
    });

    await analyticsEvent.save();

    // Increment click counter on parent URL
    urlDocument.clickCount += 1;
    await urlDocument.save();

  } catch (error) {
    console.error('Error logging click analytics:', error);
  }
};

/**
 * Retrieves aggregate analytical views for a specific URL.
 */
export const getUrlAnalytics = async (urlId, userId) => {
  // Ensure ownership of URL first
  const url = await Url.findOne({ _id: urlId, userId });
  if (!url) {
    throw new Error('URL not found or unauthorized');
  }

  // Get raw analytics entries
  const clickLogs = await Analytics.find({ urlId }).sort({ timestamp: -1 });

  // Compute Device split
  const deviceMap = {};
  const browserMap = {};
  const referrerMap = {};
  const timelineMap = {};

  clickLogs.forEach((log) => {
    // Devices
    deviceMap[log.device] = (deviceMap[log.device] || 0) + 1;

    // Browsers (group by browser family name)
    const browserFamily = log.browser.split(' ')[0] || 'Unknown';
    browserMap[browserFamily] = (browserMap[browserFamily] || 0) + 1;

    // Referrers (clean URLs, e.g., extract hostname)
    let refDomain = 'Direct';
    if (log.referrer !== 'Direct') {
      try {
        refDomain = new URL(log.referrer).hostname;
      } catch (err) {
        refDomain = log.referrer;
      }
    }
    referrerMap[refDomain] = (referrerMap[refDomain] || 0) + 1;

    // Timeline - Group by local date (YYYY-MM-DD)
    const dateString = log.timestamp.toISOString().split('T')[0];
    timelineMap[dateString] = (timelineMap[dateString] || 0) + 1;
  });

  // Format charts objects
  const devices = Object.keys(deviceMap).map(name => ({ name, value: deviceMap[name] }));
  const browsers = Object.keys(browserMap).map(name => ({ name, value: browserMap[name] }));
  const referrers = Object.keys(referrerMap).map(name => ({ name, value: referrerMap[name] }));
  
  // Sort timeline chronological
  const timeline = Object.keys(timelineMap)
    .sort()
    .map(date => ({ date, clicks: timelineMap[date] }));

  return {
    totalClicks: url.clickCount,
    title: url.title,
    originalUrl: url.originalUrl,
    shortUrl: url.shortUrl,
    slug: url.slug,
    createdAt: url.createdAt,
    devices,
    browsers,
    referrers,
    timeline,
  };
};

/**
 * Retrieves aggregate summary across all of a user's URLs.
 */
export const getUserAnalyticsSummary = async (userId) => {
  const userUrls = await Url.find({ userId });
  const urlIds = userUrls.map((u) => u._id);

  const totalUrlsCount = userUrls.length;
  const totalClicksCount = userUrls.reduce((sum, u) => sum + u.clickCount, 0);

  // Retrieve last 10 click records
  const recentClicks = await Analytics.find({ urlId: { $in: urlIds } })
    .sort({ timestamp: -1 })
    .limit(10)
    .populate({
      path: 'urlId',
      select: 'title slug shortUrl'
    });

  return {
    totalUrls: totalUrlsCount,
    totalClicks: totalClicksCount,
    recentClicks: recentClicks.map(c => ({
      id: c._id,
      timestamp: c.timestamp,
      device: c.device,
      browser: c.browser,
      referrer: c.referrer,
      slug: c.urlId?.slug || '',
      title: c.urlId?.title || ''
    }))
  };
};
