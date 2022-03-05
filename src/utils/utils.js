import * as Currencies from '@dinero.js/currencies';
import _rates from './rates.json';
import { dinero, convert } from 'dinero.js';
export const ratesInstance = (function () {
    let instance;
    function createInstance() {
        let object = {
            rates: _rates
        };
        return object;
    }

    return {
        getInstance: function () {
            if (!instance) {
                instance = createInstance();
            }
            return instance;
        }
    };
})();
export const getCustomerFullName = (customer) => {
    const { firstName, lastName } = customer;
    return `${firstName} ${lastName}`
}
export const getCustomerAggregatedNetWorth = (customer) => {
    let portfoliosTotalValue = 0;
    customer.portfolios.forEach(portfolio => {
        let portfolioCapitalGain = 0;
        let assetsTotalValue = 0;
        portfolio.assets.forEach(asset => {
            const assetCapitalGain = parseInt(asset.quantity) * convertToEURO(parseInt(asset.capitalGainPerAsset), asset.currency);
            const assetTotalValue = parseInt(asset.quantity) * convertToEURO(parseInt(asset.valuePerAsset), asset.currency) + assetCapitalGain;
            assetsTotalValue += assetTotalValue;
            portfolioCapitalGain += assetCapitalGain;
        })
        let portfolioTotalValue = portfolioCapitalGain + assetsTotalValue;
        portfoliosTotalValue += portfolioTotalValue;
    })
    const customerNetWorth = portfoliosTotalValue;
    return customerNetWorth;
}
export const getCustomerAggregatedRestrictions = (customer) => {
    return customer.portfolios.reduce((p, c) => p + ' ' + c.restrictionStatus, '').trim();
}
export const getCustomerAggregatedCapitalGain = (customer) => {
    let capitalGain = 0;
    customer.portfolios.forEach(portfolio => {
        portfolio.assets.forEach(asset => {
            capitalGain += convertToEURO(parseInt(asset.capitalGainPerAsset), asset.currency) * parseInt(asset.quantity)
        })
    })
    return capitalGain;
}

export const convertToEURO = (amount, currency) => {
    const rates = ratesInstance.getInstance().rates;
    const d = dinero({ amount, currency: Currencies[currency], scale: 2 });
    const usd = convert(d, Currencies['EUR'], rates[currency]).toJSON();
    return parseInt((usd.amount / Math.pow(10, usd.scale)));
}
