import { useEffect, useState } from 'react';
import Table from './Components/Table/Table';
import { Container, Row, Col } from 'react-bootstrap';
import {
  getCustomerFullName,
  getCustomerAggregatedNetWorth,
  getCustomerAggregatedRestrictions,
  getCustomerAggregatedCapitalGain,
  convertToEURO,
  ratesInstance
} from './utils/utils';

import data from './data.json'


const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'June', 'July', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec']
function App() {
  const [currencyExchangeRates, setCurrencyExchangeRates] = useState(1644085276 * 1000);
  useEffect(() => {
    fetch('https://freecurrencyapi.net/api/v2/latest?apikey=9fc011a0-86af-11ec-8d59-8560df2ac44e')
      .then(res => res.json())
      .then(res => {
        let currencies = res.data;
        // convert base from USD to EUR
        const ratio = currencies.EUR;
        const rates = {};

        Object.keys(currencies).forEach(key => {
          rates[key] = {
            EUR: { amount: parseInt((currencies[key] * 100) / ratio), scale: 2 }
          }
        })
        rates['USD'] = {
          EUR: { amount: parseInt((1 * 100) / ratio), scale: 2 }
        }
        ratesInstance.getInstance().rates = rates;
        setCurrencyExchangeRates(parseInt(res.query.timestamp) * 1000);
      })
  }, [])
  const parentColumns = [
    { key: 'fullName', name: 'Full Name' },
    { key: 'riskProfile', name: 'Risk Profile' },
    { key: 'netWorth', name: 'Net Worth' },
    { key: 'restrictions', name: 'Restrictions' },
    { key: 'capitalGain', name: 'Capital Gain' },
  ];
  const firstChildColumns = [
    { key: 'portfolioName', name: 'Name' },
    { key: 'restrictionStatus', name: 'Restriction Status' },
  ]

  const secondChildColumns = [
    { key: 'assetName', name: 'Name' },
    { key: 'assetType', name: 'Type' },
    { key: 'location', name: 'Location' },
    { key: 'quantity', name: 'Quantity' },
    { key: 'valuePerAsset', name: 'Value' },
    { key: 'capitalGainPerAsset', name: 'Capital Gain' },
    { key: 'associatedRiskPerAsset', name: 'Associated Risk' },
  ]

  const rows = data.map(el =>
  ({
    ...el,
    fullName: getCustomerFullName(el),
    netWorth: getCustomerAggregatedNetWorth(el),
    restrictions: getCustomerAggregatedRestrictions(el),
    capitalGain: getCustomerAggregatedCapitalGain(el),
    portfolios: el.portfolios.map(portfolio =>
    ({
      ...portfolio,
      assets: portfolio.assets.map(asset => (
        {
          ...asset,
          valuePerAsset: convertToEURO(parseInt(asset.valuePerAsset), asset.currency),
          capitalGainPerAsset: convertToEURO(parseInt(asset.capitalGainPerAsset), asset.currency),
          associatedRiskPerAsset: convertToEURO(parseInt(asset.associatedRiskPerAsset), asset.currency),
        })
      )
    }
    ))
  }));

  return (
    <Container fluid="xl" key={currencyExchangeRates}>
      <Row className="mt-5 text-center">
        <p className="display-5">Financial Institution Single Page Application (SPA)</p>
        {currencyExchangeRates ? <p className="font-italic text-secondary">Currency Exchange Rates updated: {`${new Date(currencyExchangeRates).getFullYear()} ${months[new Date(currencyExchangeRates).getMonth()]} ${new Date(currencyExchangeRates).getDate()}  ${new Date(currencyExchangeRates).getHours()}:${new Date(currencyExchangeRates).getMinutes()} `}</p> : null}
      </Row>
      <Row className="mt-5">
        <Col>
          <Table
            dataId={"clientId"}
            columns={parentColumns}
            rows={rows}
            defaultSort={[-1]}
            childProp={'portfolios'} child={
              <Table
                dataId={"portfolioId"}
                tableProps={{ className: 'bg-secondary' }}
                columns={firstChildColumns}
                childProp={'assets'} child={
                  <Table
                    dataId={"isin"}
                    tableProps={{ variant: "dark", size: 'sm' }}
                    columns={secondChildColumns}
                    defaultSort={[-1]}>
                  </Table>
                } />
            } />
        </Col>
      </Row>
    </Container>
  );
}

export default App;
