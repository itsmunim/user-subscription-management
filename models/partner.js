module.exports = function (name) {
  this.name = name;

  this.grant = function (user, period) {
    if (!period) {
      return;
    }

    const offer = user.getOngoingOffer();
    if (!offer) {
      user.extendOffer(period);
    } else {
      if (offer.partner.name === this.name) {
        user.extendOffer(period);
      }
    }
  };

  this.revoke = function (user) {
    const offer = user.getOngoingOffer();
    if (offer && offer.partner.name === this.name) {
      user.cancelOffer();
    }
  };
};