import { createBrowserRouter, RouterProvider, Route, createRoutesFromElements } from "react-router-dom";
import Home from "./pages/home";
import {AiOutlineLoading3Quarters } from "react-icons/ai";


const App = () => {
  const router = createBrowserRouter(
    createRoutesFromElements( <>
     <Route path="/" index  element={<Home/>} />
     </>
    )
  )


return ( <>
  <RouterProvider router={router} />
    <div className="google-auth-modal my-d-none" id="isSending">
      <div className="my-mother down-20 xs-down-40vh">
         <AiOutlineLoading3Quarters className="fa fa-spin px30 color-code-1" />
         <div className="my-mother xs-down-5 down-5" ><span className="InterLight px13"  id="sending-msg"></span></div>
      </div>
     </div>
   <div className="my-toast" id="my-toast">
    <div className="xs-container my-col-10">
      <div className="xs-12 down-1"><span id="msg" className=""></span></div>
    </div>
   </div>
</> );
}
 
export default App;