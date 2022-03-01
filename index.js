const { GrowthBook } = require('@growthbook/growthbook');
const axios = require('axios');

// Load environment variables from .env file//////////////////////////////////////////////////////
require('dotenv').config();
const GROWTHBOOK_DOMAIN = process.env.GROWTHBOOK_DOMAIN;
const GROWTHBOOK_API_KEY = process.env.GROWTHBOOK_API_KEY;
const FEATURE_FLAG_DEFINED = process.env.FEATURE_FLAG_DEFINED;
const COMPANY_NAME = process.env.COMPANY_NAME;
if (!GROWTHBOOK_DOMAIN || !GROWTHBOOK_API_KEY) {
    console.error('Please set the GROWTHBOOK_DOMAIN and GROWTHBOOK_API_KEY environment variables');
    process.exit(1);
}

const FEATURES_ENDPOINT = `${GROWTHBOOK_DOMAIN}/api/features/${GROWTHBOOK_API_KEY}`;
///////////////////////////////////////////////////////////////////////////////////////////////////


function refreshFeatureFlags(growthbook) {
  console.log("refreshing features flags from GrowthBook");
  axios.get(FEATURES_ENDPOINT)
  .then((response) => { 
    growthbook.setFeatures(response.data.features);
  })
  .catch((e) => {
    console.log(e);
  });
}

const growthbook = new GrowthBook({
  attributes: {
    company: COMPANY_NAME,
    // .. other attributes
  }
});

setInterval(() => refreshFeatureFlags(growthbook), 3000);

setInterval(function(){
  if (growthbook.isOn(FEATURE_FLAG_DEFINED)) {
    console.log(`${FEATURE_FLAG_DEFINED} is On for this user`);
  }
  else {
    console.log(`${FEATURE_FLAG_DEFINED} is Off for this user`);
  }
}, 1000);

