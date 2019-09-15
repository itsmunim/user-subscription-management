#### User Subscription Manager

A simple implementation of how multiple subscriptions for a user could be managed. Mainly a coded POC on top of some static JSON data. But can be transformed to use any data source like file or database.

#### Rules

- A user can have multiple offers from multiple partners
- If a user has an offer from a partner and he got another one, which is not conflicting within the date range of previous, then it should just be added to his/her subscription list
- If a user gets an offer from a partner, which conflicts with date range of an existing offer then there can be two cases-
    - If the offer is from same partner, the previous offer will get extended by the amount of time the new offer would be valid for. For example, if the previous offer was A and it was valid till March and then a new offer came in from same partner which is valid from Feb to May; then 4 months of time will be added to previous offer, making offer A to be valid upto July
    - If the offer is from another partner, that will be ignored
- A partner can issue a revoke offer to a user, and if the revoke offer falls within any of the active offer, that offer will have an updated end date which is aligned to that revocation
    - For example, if an offer was from Jan to May and the revocation issued is upto April, then the offer will be squeezed to become Jan to April


#### Example Scenario

Suppose, John uses a subscription management software called Olga. Using this manager, John can manage multiple subscriptions which he can buy from Olga. There are subscriptions like Netflix, Hulu, Amazon Prime, Hotstar, BongoBD etc. But the subscriptions can only be managed using the above rules and hence Olga could be using this code underneath.

#### Data Formats

This is a POC and hence uses some static JSON files as datasources.

##### User Accounts

`data/accounts.json`

Has a list of users with each user having their phone number and name. Something like this-

```
{
  "number": "42704109745",
  "name": "Farhan"
}
```

##### Partner Subscription Info Files

`data/amazecom.json`, `data/wondertel.json` etc.

Has a list of `grant` type offer which are actual offers and `revocation` type offers which can invalidate some other valid/active offer-

```
{
  "revocations": [
    {
      "number": "77902601451",
      "date": "2015-04-30T20:34:44+00:00"
    },
    {
      "number": "33024924547",
      "date": "2015-01-18T05:45:23+00:00"
    }
  ],
  "grants": [
    {
      "period": 3,
      "number": "90702746086",
      "date": "2015-03-10T04:55:10+00:00"
    },
    {
      "period": 3,
      "number": "27528742433",
      "date": "2015-07-21T01:34:10+00:00"
    }
  ]
}
```

#### Running the Simulation

- `npm i`
- `npm start`
