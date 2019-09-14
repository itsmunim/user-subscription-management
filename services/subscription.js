const moment = require('moment');
const constants = require('../common/constants');

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

  if (!user.offers.length || !isOfferWithinLast) {
    // if offer startdate is not in between last offer or the offer
    // list is empty, simply push it
    user.offers.push(offer);
    console.log('New offer, stacking', offer);
    return;
  }

  if (isLastFromSamePartner && isOfferWithinLast) {
    const diff = moment(offer.startDate).diff(moment(offer.endDate), 'months');
    lastOffer.endDate = moment(lastOffer.endDate)
      .add(diff, 'months').format(constants.DATE_FORMAT);
    console.log('Extending offer from same partner', lastOffer);
  }
}

function _performRevoke(user, offer) {
  const offersFromSamePartner = _getOffersForSimilarPartner(user, offer.partner);
  const offersContainingRevokationDate = offersFromSamePartner.filter(o => _isOverlapping(o, offer));

  if (offersContainingRevokationDate.length) {
    const offerToUpdate = offersContainingRevokationDate[0];
    console.log('Revoking offer', offerToUpdate);
    offerToUpdate.endDate = offer.startDate;
    console.log('Updated offer after revocation', offerToUpdate);
  }
}

module.exports = {
  assignOffer
};
