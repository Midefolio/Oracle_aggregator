import { useContext, useEffect, useState } from "react";
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
  const [prices, setPrices] = useState ([])

  useEffect(() => {
    if (selected) {
      setSymbol(selected?.tsyms);
    }
  }, [selected]);

  const getPriceFeedHandler = async (shouldLoad) => {
    // Endpoints defined: fetching from Pyth, ChainLink, and Diadata oracles
    const pythURl = `https://hermes.pyth.network/v2/updates/price/latest?ids%5B%5D=${selected?.id}&encoding=hex`;
    const chainLinkUrl = `https://min-api.cryptocompare.com/data/pricemultifull?fsyms=${selected?.fsyms}&tsyms=${selected?.tsyms}`;
    const diaDataUrl = `https://api.diadata.org/v1/quotation/${selected?.fsyms}`;
    setIsFetching(shouldLoad)
    
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
        computedFrom.push({name:"Pyth Network", price:pythPrice});
      }

      // Extract ChainLink price feed
      if (chainLinkResult.status === 'fulfilled' && chainLinkResult.value.data.RAW) {
        chainLinkPrice = chainLinkResult.value.data.RAW[selected.fsyms][selected.tsyms].PRICE;
        totalPrice += chainLinkPrice;
        count++;
        computedFrom.push({name:"ChainLink", price:chainLinkPrice});
        setImage('https://www.cryptocompare.com/' + chainLinkResult.value.data.RAW[selected?.fsyms][selected?.tsyms]['IMAGEURL']);
      }

      // Extract Diadata.org price
      if (diaResult.status === 'fulfilled' && diaResult.value.data.Price) {
        diaPrice = parseFloat(diaResult.value.data.Price);
        totalPrice += diaPrice;
        count++;
        computedFrom.push({name:"Diadata", price:diaPrice});
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
      getPriceFeedHandler(true);
      const interval = setInterval(() => {
        getPriceFeedHandler(false);
      }, 60000); // Fetch data every minute
      return () => clearInterval(interval);
    }
  }, [selected]);

  return (
    <>
      {isfetching ? <div className="my-mother xs-down-20"><CustomSkeleton /></div> : (
        <div className="my-mother">
          {error && <ErrorModal />}
          {image && (
            <div className="my-col-4  xs-12 xs-down-5 top-3">
              <div className="img-container">
                <img src={image} alt="Coin" />
              </div>
                <div className="hidden-l mg-10"><span className="px13">Price Updates every 60s </span></div>
            </div>
          )}
          {aggregatedPrice && (
            <div className="my-col-7 off-1 down-2">
              <div className="my-mother">
                {/* <span className="px20 InterSemiBol rad-30">{selected?.label}</span> */}
                <div className="my-mother down-3 xs-down-2">
                  {computedFrom.map((i, index) => (
                  <div className="my-col-4 xs-4" key={index}>
                    <div className="container px10  " >{i.name} Price:</div>
                    <div className="container down-3 InterSemiBold px12" >${formatNumber(i.price)}</div>
                  </div>
                  ))}
                </div>
              </div>
              <div className="my-mother down-3 xs-down-2">
                <div className="my-mother top-bd"><span className="px12 InterLight">Aggregate Price for <b>{selected?.label}</b></span></div>
                <span className="px50 xs-px40 my-mother InterSemiBold">
                  <span>{`${symbol}` === 'USD' ? <span>$</span>:<span>{symbol}</span>}</span>
                  {formatNumber(aggregatedPrice)}
                </span>
              </div>
              <div className="my-mother xs-down-5 down-1 xs-down-1xs-px10  px10">
              </div>
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default Result;
