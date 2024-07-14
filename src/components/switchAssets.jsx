import { useContext, useEffect, useState } from "react";
import useApi from "../hook/useApi";
import { UtilsContext } from "../context/utilsContext";
import useUtils from "../utils/useutils";
import ErrorModal from "./errorModal";

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
