import { AiOutlinePieChart } from "react-icons/ai";

const NavBar = () => {
    return ( <>
      <nav className="hidden-xs">
        <div className="my-col-10 off-1">
            <div className="my-col-2"><span className="logo interBold"><AiOutlinePieChart className="px20"/> OracleAggregator</span></div>
            <div className="my-col-8 centered">
                <span className="nav-links">Contact</span>
                <span className="nav-links">Video Tour</span>
                <span className="nav-links" onClick={()=> {window.open('https://github.com/Midefolio/Oracle_aggregator')}}> <i className="fab fa-github"></i> Git Repo</span>
            </div>
            <div className="my-col-2"><a href='#feeds' className="fl-right white rad-30 px13 InterSemiBold down-3 nav-links my-b-shadow bg-black">Price feeds <i className="fas mg-10 fa-arrow-down"></i></a></div>
        </div>
      </nav>



      <div className="mobile-nav hidden-ls xs-down-5" >
        <div className="xs-container">
          <i className="fas fa-bars px30" ></i>
          <span className="fl-right px20" onClick={()=> {window.open('https://github.com/Midefolio/Oracle_aggregator')}} > <i className="fab fa-github"></i> Git Repo</span>
        </div>
      </div>
    
    </> );
}
 
export default NavBar;