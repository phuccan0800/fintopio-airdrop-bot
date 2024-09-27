const axios = require('axios');
const BASE_URL = 'https://fintopio-tg.fintopio.com/api/';

async function fetchReferralData(token, proxyAgent) {
  try {
    const { data } = await axios({
      url: BASE_URL + 'referrals/data',
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      httpsAgent: proxyAgent,
    });

    return data;
  } catch (error) {
    throw error;
  }
}

async function fetchTasks(token, proxyAgent) {
  try {
    const { data } = await axios({
      url: BASE_URL + 'hold/tasks',
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      httpsAgent: proxyAgent,
    });

    return data;
  } catch (error) {
    throw error;
  }
}

async function startTask(token, id, proxyAgent) {
  try {
    const { data } = await axios({
      url: BASE_URL + `hold/tasks/${id}/start`,
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      data: {},
      httpsAgent: proxyAgent,
    });

    return data;
  } catch (error) {
    throw error;
  }
}

async function claimTask(token, id, proxyAgent) {
  try {
    const { data } = await axios({
      url: BASE_URL + `hold/tasks/${id}/claim`,
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      data: {},
      httpsAgent: proxyAgent,
    });

    return data;
  } catch (error) {
    throw error;
  }
}

async function dailyCheckin(token, proxyAgent) {
  try {
    const { data } = await axios({
      url: BASE_URL + 'daily-checkins',
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      data: {},
      httpsAgent: proxyAgent,
    });

    return data;
  } catch (error) {
    throw error;
  }
}

async function startFarming(token, proxyAgent) {
  try {
    const { data } = await axios({
      url: BASE_URL + 'farming/farm',
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      data: {},
      httpsAgent: proxyAgent,
    });

    return data;
  } catch (error) {
    throw error;
  }
}

async function claimFarming(token, proxyAgent) {
  const { data } = await axios({
    url: BASE_URL + 'farming/claim',
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
    },
    data: {},
    httpsAgent: proxyAgent,
  });

  return data;
}

async function fetchDiamond(token, proxyAgent) {
  try {
    const { data } = await axios({
      url: BASE_URL + 'clicker/diamond/state',
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      httpsAgent: proxyAgent,
    });

    return data;
  } catch (error) {
    throw error;
  }
}

async function claimDiamond(token, id, proxyAgent) {
  try {
    const { data } = await axios({
      url: BASE_URL + 'clicker/diamond/complete',
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      data: {
        diamondNumber: id,
      },
      httpsAgent: proxyAgent,
    });

    return data;
  } catch (error) {
    throw error;
  }
}

module.exports = {
  fetchReferralData,
  fetchTasks,
  startTask,
  claimTask,
  dailyCheckin,
  startFarming,
  claimFarming,
  fetchDiamond,
  claimDiamond,
};
