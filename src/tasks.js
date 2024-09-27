const {
  fetchReferralData,
  claimFarming,
  startFarming,
  fetchTasks,
  startTask,
  claimTask,
  dailyCheckin,
  fetchDiamond,
  claimDiamond,
} = require('./api');
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const moment = require('moment');
const colors = require('colors');
function log(index, type, msg) {

  const timestamp = new Date().toLocaleTimeString();
  switch (type) {
    case 'success':
      console.log(`[${timestamp}] [${index}] ${msg}`.green);
      break;
    case 'custom':
      console.log(`[${timestamp}] [${index}] ${msg}`.magenta);
      break;
    case 'error':
      console.log(`[${timestamp}] [${index}] ${msg}`.red);
      break;
    case 'warning':
      console.log(`[${timestamp}] [${index}] ${msg}`.yellow);
      break;
    default:
      console.log(`[${timestamp}] [${index}] ${msg}`.blue);
  }

}
async function automaticFlow(index, token, proxyAgent) {
  while (true) {
    try {
      let userInfo = await fetchReferralData(token, proxyAgent);
      log(index, 'custom', `[Balance: ${parseFloat(userInfo.balance).toFixed(1)}] [Ref: ${userInfo.activations.used}/${userInfo.activations.total}] [Rank: ${userInfo.leaderboard.position}]`);

      await handleDailyCheckin(index, token, proxyAgent);

      await handleAllTasks(index, token, proxyAgent);

      const nexClaimDiamondTime = await handleDiamond(index, token, proxyAgent);

      await handleFarming(index, token, proxyAgent);
      let delayTime = 1000;
      if (nexClaimDiamondTime) {
        const currentTime = moment();
        delayTime = nexClaimDiamondTime.diff(currentTime);
      }
      log(index, 'custom', `[Waiting] [Next: ${moment().add(delayTime, 'milliseconds').format('h:mm:ss A')}]`);
      await delay(delayTime);
    } catch (error) {
      log(index, 'error', `Error in automatic flow: ${error.response?.data ? error.response.data.message : error.message}`);
    }

  }
}


async function handleAllTasks(index, token, proxyAgent) {
  let completedTasks = 0;
  let pendingTasks = 0;
  const tasks = await fetchTasks(token, proxyAgent);
  if (tasks) {
    for (const item of tasks.tasks) {
      try {
        if (item.status === 'available') {
          const startedTask = await startTask(token, item.id, proxyAgent);
          if (startedTask.status === 'verifying') {
            const claimedTask = await claimTask(token, item.id, proxyAgent);
            await delay(1000);
            if (claimedTask) {
              completedTasks++;
            }
            else {
              pendingTasks++;
            }
          }
        } else {
          const claimedTask = await claimTask(token, item.id, proxyAgent);
          if (claimedTask) {
            completedTasks++;
          } else {
            pendingTasks++;
          }
          await delay(1000);
        }
      } catch (error) {
        pendingTasks++;
      }
    }
    log(index, 'success', `[Total tasks: ${tasks.tasks.length}] [Completed: ${completedTasks}] [Fail: ${pendingTasks}]`);
  }
}


async function handleDiamond(index, token, proxyAgent) {
  try {
    const getDiamondo = await fetchDiamond(token, proxyAgent);

    if (getDiamondo.state === 'unavailable') {
      const nextClaimTime = moment(getDiamondo.timings.nextAt);
      log(index, 'warning', `[Claim Diamond] [Next claim: ${nextClaimTime.format('h:mm:ss A')}]`);
      return nextClaimTime;
    } else {
      await claimDiamond(token, getDiamondo.diamondNumber, proxyAgent);
      log(index, 'success', `[Claim Diamond] [Reward: ${getDiamondo.settings.totalReward} 💎]`);
      return null;
    }
  } catch (error) {
    log(index, 'error', `Error cracking diamond: ${error.response?.data ? error.response.data.message : error.message}`);
    return null;
  }
}


async function handleDailyCheckin(index, token, proxyAgent) {
  try {
    const checkinData = await dailyCheckin(token, proxyAgent);
    if (checkinData.claimed) {
      log(index, 'success', `[Daily check-in] [Total: ${checkinData.totalDays}] [Reward: ${checkinData.dailyReward}]`);
    } else {
      log(index, 'warning', `You've already done the daily check-in. Try again tomorrow!`);
    }
  } catch (error) {
    console.log(error);
    log(index, 'error', `Error in daily check-in: ${error.response?.data ? error.response.data.message : error.message}`);
  }
}


async function handleFarming(index, token, proxyAgent) {

  try {
    const farm = await claimFarming(token, proxyAgent);
    if (farm) {
      log(index, 'success', `[Farming] [Claimed] [Start: ${moment(farm.timings.start).format('h:mm:ss A')}] [End: ${moment(farm.timings.finish).format('h:mm:ss A')}]`);
    }
  } catch (error) {
    if (error.response?.data?.message.includes('not finished yet')) {
      log(index, 'warning', `[Farming] [Not finished yet]`);
      let reFarm = null;
      try {
        reFarm = await startFarming(token, proxyAgent);
      } catch (error) {
      }
      if (reFarm) {
        log(index, 'success', `[Farming] [Start: ${moment(reFarm.timings.start).format('h:mm:ss A')}] [End: ${moment(reFarm.timings.finish).format('h:mm:ss A')}]`);
      }
    } else {
      log(index, 'error', `[Farming] [${error.response?.data?.message || error.message}]`);
    }
  }
}


module.exports = {
  automaticFlow,
};
