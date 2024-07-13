# Oracle Aggregator
This Oracle Aggregator is a React-based application that fetches and aggregates price feeds from multiple oracle sources, such as Pyth Network, Chainlink and DiaData. The aggregated price is then displayed on the frontend. This project can be deployed on platforms like Cloudflare or Vercel for seamless integration and hosting.


# Features

- Fetches price feeds from Pyth Network, Chainlink and DiaData.
- Aggregates the price feeds.
- Displays the aggregated price along with the sources used for computation.
- Includes error handling and loading states for better user experience.
- Refreshes the data every minute to ensure up-to-date information.


## Getting Started

### Prerequisites

Make sure you have the following installed:

- Node.js (>= 14.x)
- npm (>= 6.x) or yarn (>= 1.x)

### Installation

1. Clone the repository:

```bash
git clone https://github.com/your-username/oracle-aggregator.git
cd oracle-aggregator
```

2. Install the dependencies:

```bash
    npm install
    # or
    yarn install
```


# Running the Application
To start the development server:

```bash
npm run dev
# or  
yarn dev
```

# Deployment

# Deploying to Vercel

1. Install the Vercel CLI:

```bash
npm install -g vercel
```

2. Deploy the application:

```bash
vercel
```

Follow the prompts to link or create a new Vercel project. Your application will be deployed and you will receive a URL for your live application.

# Deploying to Cloudflare Pages

1. Install the Cloudflare CLI:

```bash
npm install -g wrangler
```

2. Authenticate with Cloudflare:


```bash
wrangler login
```


3. Configure your project:


```bash
wrangler init
```

Edit the wrangler.toml file with your project settings


4. Build and deploy the application:

```bash
npm run build
wrangler pages publish build
```


# Usage

- Select an asset from the dropdown to view its aggregated price.
- The application will fetch price feeds from Pyth Network and Chainlink, aggregate them, and display the result.
- The price is refreshed every minute to ensure accuracy.


## Components

1. Switch AssectsType Component

The AssectsType component enables for easy selection of assets type (Crypto and Fx assests).

```jsx
import { useContext, useEffect, useState } from "react";
import useApi from "../hook/useApi";
import { UtilsContext } from "../context/utilsContext";
import useUtils from "../utils/useutils";

const Aggregator = () => {
    const { setAssets } = useContext(UtilsContext)
    const { makeRequest } = useApi();
    const { getLastThreeChars } = useUtils();

    const [assetType, setAssetType] = useState("crypto");

    const getAssets = async () => {
        const api = `https://hermes.pyth.network/v2/price_feeds?asset_type=${assetType}`
        const res = await makeRequest('get', api);
        if(res){
          let newArr = [];
          res?.map((i, index) => {
            const tsyms = getLastThreeChars(i.attributes.generic_symbol);
            const obj = {id:i?.id, tsyms, fsyms:i.attributes.base,  value:i?.id,  label:i.attributes.generic_symbol};
            newArr.push(obj)
          })
          setAssets(newArr)
        }
    }
 
    useEffect(() => {
        getAssets();
    }, [assetType])



    return ( <>
      <div className="my-mother">
        <span onClick={()=> {setAssetType('crypto')}} className={`px12 c-pointer btn faded  pd-10 bg-faded rad-30 ${assetType == 'crypto' && 'active'}` }>Crypto</span>
        <span onClick={()=> {setAssetType('fx')}} className={`px12 c-pointer btn faded  pd-10 bg-faded mg-10 rad-30 ${assetType == 'fx' && 'active'}`}>Fx</span>

      </div>
    </> );
}
 
export default Aggregator;
```

2. SearchBar Component

The SearchBar component provides a dropdown for selecting an asset. It uses virtualization to handle large datasets efficiently.

```jsx
import React, { useContext, useEffect } from 'react';
import Select, { components } from 'react-select';
import { FixedSizeList as List } from 'react-window';
import { UtilsContext } from '../context/utilsContext';

const height = 35;

const MenuList = (props) => {
  const { options, children, maxHeight, getValue } = props;
  const [value] = getValue();
  const initialOffset = options.indexOf(value) * height;

  return (
    <List
      height={maxHeight}
      itemCount={children.length}
      itemSize={height}
      initialScrollOffset={initialOffset}
    >
      {({ index, style }) => <div style={style}>{children[index]}</div>}
    </List>
  );
};

const SearchBar = () => {
  const { asset, selected, setSelected } = useContext(UtilsContext);

  useEffect(() => {
    if (asset) {
      const init = asset ? asset[0] : null;
      if (init) {
        setSelected(init);
      }
    }
  }, [asset, setSelected]);

  return (
    <Select
      name="basic-select"
      value={selected}
      onChange={setSelected}
      options={asset}
      className="basic-select"
      classNamePrefix="select"
      components={{ MenuList }}
    />
  );
};

export default SearchBar;
```


3. Result Component

The Result component fetches price data from Pyth Network and Chainlink, aggregates the prices, and displays the result.

```jsx
import { useContext, useEffect, useState } from "react";
import useApi from "../hook/useApi";
import { UtilsContext } from "../context/utilsContext";
import useUtils from "../utils/useutils";
import CustomSkeleton from "./skeleton";
import ErrorModal from "./errorModal";
import axios from 'axios';

const Result = () => {
  const { selected } = useContext(UtilsContext);
  const [aggregatedPrice, setAggregatedPrice] = useState(null);
  const [image, setImage] = useState(null);
  const { formatNumber } = useUtils()
  const [isfetching, setIsFetching] = useState(true)
  const [symbol, setSymbol] = useState(null)
  const [computedFrom, setComputedFrom] = useState([])
  const [error, setError] = useState(false)

  useEffect(() => {
    if (selected) {
      setSymbol(selected?.tsyms);
    }
  }, [selected]);

  const getPriceFeedHandler = async () => {
    // Endpoints defined: fetching from Pyth, ChainLink, and Diadata oracles
    const pythURl = `https://hermes.pyth.network/v2/updates/price/latest?ids%5B%5D=${selected?.id}&encoding=hex`;
    const chainLinkUrl = `https://min-api.cryptocompare.com/data/pricemultifull?fsyms=${selected?.fsyms}&tsyms=${selected?.tsyms}`;
    const diaDataUrl = `https://api.diadata.org/v1/quotation/${selected?.fsyms}`;
    setIsFetching(true)
    
    try {
      const results = await Promise.allSettled([
        axios.get(pythURl),
        axios.get(chainLinkUrl),
        axios.get(diaDataUrl)
      ]);

      const pythResult = results[0];
      const chainLinkResult = results[1];
      const diaResult = results[2];

      if (pythResult.status !== 'fulfilled' && chainLinkResult.status !== 'fulfilled') {
        setError(true);
        return
      }

      let pythPrice = null;
      let chainLinkPrice = null;
      let diaPrice = null;
      let count = 0;
      let totalPrice = 0;
      let computedFrom = [];

      // Extract Pyth price feed
      if (pythResult.status === 'fulfilled' && pythResult.value.data.parsed) {
        const priceData = pythResult.value.data.parsed[0].price;
        pythPrice = parseFloat(priceData.price) * Math.pow(10, priceData.expo);
        totalPrice += pythPrice;
        count++;
        computedFrom.push("Pyth Network");
      }

      // Extract ChainLink price feed
      if (chainLinkResult.status === 'fulfilled' && chainLinkResult.value.data.RAW) {
        chainLinkPrice = chainLinkResult.value.data.RAW[selected.fsyms][selected.tsyms].PRICE;
        totalPrice += chainLinkPrice;
        count++;
        computedFrom.push("Chainlink");
        setImage('https://www.cryptocompare.com/' + chainLinkResult.value.data.RAW[selected?.fsyms][selected?.tsyms]['IMAGEURL']);
      }

      // Extract Diadata.org price
      if (diaResult.status === 'fulfilled' && diaResult.value.data.Price) {
        diaPrice = parseFloat(diaResult.value.data.Price);
        totalPrice += diaPrice;
        count++;
        computedFrom.push("Diadata");
      }

      if (count < 1) {
        setError(true)
        return
      }

      // Compute the average price
      const averagePrice = totalPrice / count;
      setAggregatedPrice(averagePrice);
      setComputedFrom(computedFrom);
      setIsFetching(false)

    } catch (error) {
      setError(true);
    }
  };

  useEffect(() => {
    if (selected) {
      getPriceFeedHandler();
      const interval = setInterval(() => {
        getPriceFeedHandler();
      }, 60000); // Fetch data every minute
      return () => clearInterval(interval);
    }
  }, [selected]);

  return (
    <>
      {isfetching ? <CustomSkeleton /> : (
        <div className="my-mother">
          {error && <ErrorModal />}
          {image && (
            <div className="my-col-4 top-3">
              <div className="img-container">
                <img src={image} alt="Coin" />
              </div>
            </div>
          )}
          {aggregatedPrice && (
            <div className="my-col-8 down-2">
              <div className="my-mother down-">
                <span className="px20 InterSemiBol rad-30">{selected?.label}</span>
              </div>
              <div className="my-mother down-3">
                <span className="px50 InterSemiBold">
                  <span>{`${symbol}` === 'USD' ? <span>$</span> : <span>{symbol}</span>} </span>
                  {formatNumber(aggregatedPrice)}
                </span>
              </div>
              <div className="my-mother down-3 xs-down-1 px10">
                <span>Price computed from </span>
                <span>{computedFrom.slice(0, 3).map((i, index) => (
                  <span className="pd-5 bg-faded InterSemiBold rad-30 mg-10" key={index}>{i}</span>
                ))}</span>
              </div>
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default Result;
```


# Contributing
If you'd like to contribute, please fork the repository and use a feature branch. Pull requests are warmly welcome.

# License
This project is licensed under the MIT License.

# Contact
If you have any questions or need further assistance, please contact [ayomidebabatundeolosho@gmail.com].
