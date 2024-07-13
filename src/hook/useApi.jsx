import axios from 'axios';
import useUtils from '../utils/useutils';

const useApi = () => {
  const { setToast } = useUtils();
  const makeRequest = async (method, api, params, cb, token, abortController) => {
    const headers = {'Content-Type': 'application/json'};
    if (token) {headers['Authorization'] = `Bearer ${token}`}
    const details = {
      method,
      url:api,
      headers,
      data: params, 
      signal:abortController?.current.signal,
    };
    try {
      const response = await axios(details);
      return response?.data;
    } catch (error) {
      if(error.message === 'Network Error'){
        setToast('Network Error: Please check your internet and try again')
        return 
      }
      return error;
    }
  }

  
 
return {
  makeRequest,
 };
}
 
export default useApi;