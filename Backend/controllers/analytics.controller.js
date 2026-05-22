import * as analyticsService from '../services/analytics.service.js';

/**
 * Handles fetching analytical report breakdown for a single short URL.
 */
export const getUrlStats = async (req, res, next) => {
  try {
    const { urlId } = req.params;
    const userId = req.auth.userId;

    const stats = await analyticsService.getUrlAnalytics(urlId, userId);

    return res.status(200).json({
      success: true,
      data: stats,
    });
  } catch (error) {
    if (error.message.includes('not found') || error.message.includes('unauthorized')) {
      return res.status(404).json({ success: false, error: error.message });
    }
    next(error);
  }
};

/**
 * Handles fetching aggregated totals and recent click events feed.
 */
export const getDashboardSummary = async (req, res, next) => {
  try {
    const userId = req.auth.userId;

    const summary = await analyticsService.getUserAnalyticsSummary(userId);

    return res.status(200).json({
      success: true,
      data: summary,
    });
  } catch (error) {
    next(error);
  }
};
