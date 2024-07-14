import Switcher from "../components/switchAssets";
import Result from "../components/result";
import SearchBar from "../components/searchBar";
import NavBar from "../components/nav";

const Home = () => {
    return ( <div className="my-mother">
      <div className="bg-landing">
      <NavBar/>
      <div className="my-col-10  xs-container xs-down-15 centered off-1 down-5">
        <div className="my-mother"><span className="interBold px50 xs-px30" >Oracle Aggregator (Talent Olympics)</span></div>
        <div className="my-mother down-1 xs-down-5"><span className="px20 xs-px15">Our feeds are computed from multiple Oracles including <span className="InterSemiBold">Pyth Network</span> </span></div>
      </div>

      <div className="my-bottom-50 xs-container h-300 rad-30 xs-down-10 my-b-shadow bg-white hidden-ls">
        <div className="xs-down-10 xs-container" id="feeds">
          <div className="my-col-10 xs-12 off-1 down-3">
          <div className="xs-6  xs-down-3"><Switcher/></div>
         <div className="xs-6"><SearchBar/></div>
         <div className="my-mother down-3 centered"><Result/></div>
          </div>
        </div>
      </div>


      </div>
      <div className="my-bottom-20 xs-12 my-b-shadow my-bottom-50 bg-faded my-col-12 hidden-xs">
        <div className="my-col-6 xs-container bg-white h-300 off-3 top-9 rad-30 my-b-shadow" id="feeds">
          <div className="my-col-10 off-1 down-3">
          <div className="my-col-3 down-3"><Switcher/></div>
         <div className="my-col-5 down-2"><SearchBar/></div>
         <div className="my-mother down-3"><Result/></div>
          </div>
        </div>
      </div>
    </div> );
}
 
export default Home;