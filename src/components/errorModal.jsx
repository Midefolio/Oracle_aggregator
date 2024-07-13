const ErrorModal = ({callbackFunction}) => {
    return ( <>
     <div className="my-modal">
        <div className="my-col-4 off-4 down-15 rad-30 bg-white my-bottom-50">
            <div className="my-col-10 off-1 down-5">
                <div className="my-mother down-3"><span className="InterSemiBold px20">We Cannot find feeds for this assest</span></div>
                <div className="my-mother xs-down-3 down-3 InterLight"><span>Possible reasons: Poor Network Connectivity</span></div>
            </div>
        </div>
     </div>
  
    
    </> );
}
 
export default ErrorModal;