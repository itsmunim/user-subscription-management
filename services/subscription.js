const moment = require('moment');
const constants = require('../common/constants');
const logger = require('./log');

function _getOffersForSimilarPartner(user, partner) {
  return user.offers.filter(offer => offer.partner.name === partner.name);
}

function _isOverlapping(offerToCheckWithin, offerToCheck) {
  const anotherOfferDate = moment(offerToCheck.startDate);
  return anotherOfferDate.isSameOrAfter(offerToCheckWithin.startDate)
    && anotherOfferDate.isSameOrBefore(offerToCheckWithin.endDate);
}

function assignOffer(user, offer) {
  switch (offer.type) {
    case 'grant':
      _performGrant(user, offer);
      break;
    case 'revocation':
      _performRevoke(user, offer);
      break;
  }
}

function _performGrant(user, offer) {
  const lastOffer = user.offers[user.offers.length - 1];
  let isOfferWithinLast = false;
  let isLastFromSamePartner = false;
  if (lastOffer) {
    isOfferWithinLast = _isOverlapping(lastOffer, offer);
    isLastFromSamePartner = lastOffer.partner === offer.partner;
  }

  logger.log(`New offer for ${user.name}`, offer);

  if (!user.offers.length || !isOfferWithinLast) {
    // if offer startdate is not in between last offer or the offer
    // list is empty, simply push it
    user.offers.push(offer);
    logger.log(`Offer added for ${user.name}`, offer);
    return;
  }

  if (isLastFromSamePartner && isOfferWithinLast) {
    const diff = moment(offer.endDate).diff(moment(offer.startDate), 'months');
    logger.log(`Extending offer for ${user.name} from same partner`, 'current offer', lastOffer, 'extension offer', offer);
    lastOffer.endDate = moment(lastOffer.endDate)
      .add(diff, 'months').format(constants.DATE_FORMAT);
    logger.log(`Offer for ${user.name} after extension`, lastOffer);
    return;
  }

  logger.log(`Already an offer active for ${user.name} in conflicting time range, ignoring`, offer);
}

function _performRevoke(user, offer) {
  const offersFromSamePartner = _getOffersForSimilarPartner(user, offer.partner);
  const offersContainingRevokationDate = offersFromSamePartner.filter(o => _isOverlapping(o, offer));

  if (offersContainingRevokationDate.length) {
    const offerToUpdate = offersContainingRevokationDate[0];
    logger.log(`Revoking offer for ${user.name}`, offerToUpdate);
    offerToUpdate.endDate = offer.startDate;
    logger.log(`Updated offer after revocation for ${user.name}`, offerToUpdate);
    return;
  }

  logger.log(`Revocation offer is not valid for ${user.name}, skipping`);
}

module.exports = {
  assignOffer
};
