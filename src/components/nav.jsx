import { AiOutlineBarChart, AiOutlineGithub, AiOutlineLineChart, AiOutlinePieChart, AiOutlinePython } from "react-icons/ai";

const NavBar = () => {
    return ( <>
      <nav>
        <div className="my-col-10 off-1">
            <div className="my-col-2"><span className="logo interBold"><AiOutlinePieChart className="px20"/> OracleAggregator</span></div>
            <div className="my-col-8 centered">
                <span className="nav-links">Contact</span>
                <span className="nav-links">Video Tour</span>
                <span className="nav-links"> <AiOutlineGithub className="px20"/> Git Repo</span>
            </div>
            <div className="my-col-2"><a href='#feeds' className="fl-right white rad-30 px13 InterSemiBold down-3 nav-links my-b-shadow bg-black">Price feeds <i className="fas mg-10 fa-arrow-down"></i></a></div>
        </div>
      </nav>
    
    </> );
}
 
export default NavBar;