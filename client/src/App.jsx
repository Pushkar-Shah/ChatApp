// import { Button } from "@/components/ui/button"
import { BrowserRouter,Navigate,Route ,Routes } from "react-router-dom"
import Auth from "./pages/auth"
import Profile from "./pages/profile"
import Chat from "./pages/chat"
import { useAppStore } from "./store/index.js"
import { useEffect,useState } from "react"
import { apiClient } from "./lib/api-client"
import { GET_USER_INFO } from "@/utils/constants";

// eslint-disable-next-line react/prop-types
const PrivateRoute = ({children}) => {
  const {userInfo} = useAppStore();
  const isAuthenticated = !!userInfo;
  return isAuthenticated ? children : <Navigate to = "/auth"/>;
};

// eslint-disable-next-line react/prop-types
const AuthRoute = ({children}) => {
  const {userInfo} = useAppStore();
  const isAuthenticated = !!userInfo;
  return isAuthenticated ? <Navigate to = "/chat"/> : children ;
};
export default function Home() {
  const {userInfo,setUserInfo} = useAppStore();
  const [loading,setLoading] = useState(true);
  useEffect(()=>{
    const getUserData = async ()=> {
      try {
        const response = await apiClient.get(GET_USER_INFO,{withCredentials:true});
        console.log(response);
        if (response.status === 200 && response.data.id) {
          setUserInfo(response.data);
        }else{
          setUserInfo(undefined);
        }
        
      } catch (error) {
        console.log(error.message);
        setUserInfo(undefined); 
      }finally{
        setLoading(false);
      }
      
      
        // setLoading(true);
        // // 
        // setUserInfo(response.data.user);
        // setLoading(false);
      }
      if(!userInfo){
        getUserData();
      }else{
        setLoading(false);
      }
  },[userInfo,setUserInfo])

  if (loading){
    return <div>Loading...</div>  // show loading component while data is being fetched  // replace with your own loading component
  }
  return (
      <BrowserRouter>
      <Routes>
        <Route path="/auth" element= {
          <AuthRoute>
          <Auth/>
          </AuthRoute>}/>
        <Route path="*" element= {<Navigate to="/auth"/>}/>
        <Route path="/profile" element= {
          <PrivateRoute>
          <Profile/>
          </PrivateRoute>
          }/>
        <Route path="/chat" element= {
          <PrivateRoute>
            <Chat/>
            </PrivateRoute>}/>
      </Routes>
      </BrowserRouter>
  )
}


