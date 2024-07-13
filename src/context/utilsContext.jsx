import { createContext, useEffect, useReducer, useState} from "react";

export const UtilsContext = createContext();


const UtilsContextProvider = (props) => {
 const [asset, setAssets] = useState([])
 const [selected, setSelected] = useState(null)
 return <UtilsContext.Provider value={{asset, setAssets, selected, setSelected}}>{props.children}</UtilsContext.Provider>
}


 
export default UtilsContextProvider;
