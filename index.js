const Offer = require('./models/offer');
const dataService = require('./services/data');
const subscriptionService = require('./services/subscription');

function findUserByPhoneNum(users, phoneNum) {
  const found = users.filter(u => u.phoneNumber === phoneNum);
  return found.length ? found[0] : null;
}

function createAndAssignOffer(users, offerDetails, type) {
  const offer = new Offer(
    offerDetails.partnerName,
    type,
    offerDetails.date,
    offerDetails.period ? offerDetails.period : null
  );
  const user = findUserByPhoneNum(users, offerDetails.number);
  if (user) {
    subscriptionService.assignOffer(user, offer);
  }
}

function showSubscriptionInfo(users) {
  let result = {
    subscriptions: {}
  };
  users.forEach(user => {
    result.subscriptions[user.name] = user.getSubscriptionInfo();
  });

  return result;
}

function run() {
  const partnerData = dataService.preparePartnerData();
  const users = dataService.prepareUsers();

  partnerData.offers.forEach((offerDetails) => {
    if (offerDetails.period) {
      createAndAssignOffer(users, offerDetails, 'grant');
    } else {
      createAndAssignOffer(users, offerDetails, 'revocation');
    }
  });

  console.log('Subscription status of all users', showSubscriptionInfo(users));
}

run();

module.exports = {
  run
};

