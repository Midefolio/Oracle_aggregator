import Aggregator from "../components/switchAssets";
import Result from "../components/result";
import SearchBar from "../components/searchBar";
import NavBar from "../components/nav";

const Home = () => {
    return ( <div className="my-mother">
      <div className="bg-landing">
      <NavBar/>
      <div className="my-col-10 centered off-1 down-5">
        <div className="my-mother"><span className="interBold px50" >Get Accurate Price feeds</span></div>
        <div className="my-mother down-1"><span className="px20">Our feeds are computed from multiple Oracles including <span className="InterSemiBold">Pyth Network</span> </span></div>
        <div className="my-mother down-4">
           <a href='#feeds'  className="my-btn-sm bg-black my-b-shadow InterSemiBold white">Price Feeds <i className="fas mg-10 fa-arrow-down"></i></a>
           <span className="my-btn-sm mg-10 bg-white my-b-shadow InterSemiBold">Video Tour <i className="fab mg-10 fa-youtube"></i></span>
        </div>
      </div>
      </div>
      <div className="my-bottom-20 my-b-shadow my-bottom-50 bg-faded my-col-12">
        <div className="my-col-8 bg-white h-300 off-2 down-2 rad-30 my-b-shadow" id="feeds">
          <div className="my-col-10 off-1 down-3">
          <div className="my-col-3 down-3"><Aggregator/></div>
         <div className="my-col-5 down-2"><SearchBar/></div>
         <div className="my-mother down-3"><Result/></div>
          </div>
        </div>
      </div>
    </div> );
}
 
export default Home;