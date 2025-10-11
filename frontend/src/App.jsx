import { useEffect } from 'react'
import './App.css'
import { Route ,Routes,Navigate } from 'react-router'
import HomePage from './pages/HomePage'
import SignUp from "./pages/SignUp"
import Login from "./pages/Login"
import { useDispatch,useSelector } from 'react-redux'
import { checkAuth } from './authSlice'
import AdminPanel from './pages/AdminPanel'
import PrblmPage from './pages/prblmPage'
import CreateQna from "./componants/adminCreateQna";
import DeletePrblm from './componants/adminDeleteOna';
import UpdatePrblm from './componants/UpdatePrblm';
import AdminUpdateQna from './componants/adminUpdateQna';
import Explore from './pages/Explore';
import Discuss from './pages/Discuss';
import Visualizers from './pages/Visualizers'
import Contest from './pages/Contest';
import Profile from './pages/Profile';
import AdminVideo from './componants/adminVideo';
import AdminUpload from './componants/adminUpload';
import Sorry from './pages/Sorry';
import EditProfile from "./componants/editProfile";
import SearchAlgo from './pages/SearchAlgo';
import SortingPage from './pages/sortingPage';
import StackQueue from './pages/StackQueue'

function App() {
    const {isAuthenticated ,loading ,user}=useSelector(state=> state.auth);
    const dispatch=useDispatch();
    
    useEffect(()=>{
          dispatch(checkAuth());
    },[dispatch]);

    if(loading)
        return(
           <div className="flex justify-center items-center h-64">
             <span className="loading loading-spinner text-primary"></span>
          </div>
        )
    
    return(
    <Routes>
      <Route path='/' element={isAuthenticated?<HomePage></HomePage>:<Navigate to={"/SignUp"}/>}></Route>
      <Route path="/SignUp" element={isAuthenticated?<Navigate to={"/"}/>:<SignUp></SignUp>}></Route>
      <Route path='/Login' element={isAuthenticated?<Navigate to={"/"}/>:<Login></Login>}></Route>

      <Route path='/admin' element={ 
        isAuthenticated && user?.role=="admin"?
        <AdminPanel></AdminPanel>:
        <Navigate to={"/"}></Navigate>
      }></Route>
      <Route path='/admin/create' element={ isAuthenticated && user?.role=="admin"?<CreateQna></CreateQna>:<Navigate to={"/"}></Navigate>}></Route>
      <Route path='/admin/update' element={ isAuthenticated && user?.role=="admin"?<AdminUpdateQna></AdminUpdateQna>:<Navigate to={"/"}></Navigate>}></Route>
      <Route path='/admin/delete' element={ isAuthenticated && user?.role=="admin"?<DeletePrblm></DeletePrblm>:<Navigate to={"/"}></Navigate>}></Route>
      <Route path='/admin/update/prblm/:id' element={ isAuthenticated && user?.role=="admin"?<UpdatePrblm></UpdatePrblm>:<Navigate to={"/"}></Navigate>}></Route>
      <Route path='/admin/video' element={ isAuthenticated && user?.role=="admin"?<AdminVideo></AdminVideo>:<Navigate to={"/"}></Navigate>}></Route>
      <Route path='/admin/upload/:id' element={isAuthenticated && user?.role=="admin"?<AdminUpload></AdminUpload>:<Navigate to={"/"}></Navigate>}></Route>
      
      <Route path='/prblm/:id' element={<PrblmPage></PrblmPage>}></Route>
      <Route path='/explore' element={isAuthenticated?<Explore></Explore>:<Navigate to={"/SignUp"}/>}></Route>
      <Route path='/discuss' element={isAuthenticated?<Discuss></Discuss>:<Navigate to={"/SignUp"}/>}></Route> 
      <Route path="/visualizers" element={isAuthenticated?<Visualizers></Visualizers>:<Navigate to={"/SignUp"}></Navigate>}></Route>
      <Route path="/visualizers/SearchAlgo" element={isAuthenticated?<SearchAlgo></SearchAlgo>:<Navigate to={"/SignUp"}></Navigate>}></Route>
      <Route path="/visualizers/sorting" element={isAuthenticated?<SortingPage></SortingPage>:<Navigate to={"/SignUp"}></Navigate>}></Route>
      <Route path="/visualizers/datastructures" element={isAuthenticated?<StackQueue></StackQueue>:<Navigate to={"/SignUp"}></Navigate>}></Route>
      <Route path='/contest' element={isAuthenticated?<Contest></Contest>:<Navigate to={"/SignUp"}/>}></Route>
      <Route path="/sorry" element={isAuthenticated?<Sorry></Sorry>:<Navigate to={"/SignUp"}/>}></Route>
      <Route path='/profile' element={isAuthenticated?<Profile></Profile>:<Navigate to={"/SignUp"}/>}></Route>
      <Route path="/editProfile" element={isAuthenticated?<EditProfile></EditProfile>:<Navigate to={"/SignUp"}/>}></Route>
    </Routes>
    )
}

export default App;
