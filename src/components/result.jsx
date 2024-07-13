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
