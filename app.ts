import schedule from "node-schedule";

async function getClosedDeals() {}

function sendEmail(deals: string[]) {}

schedule.scheduleJob(`0 0 0 * * *`, async () => {
  const closedDeals = await getClosedDeals();
});
