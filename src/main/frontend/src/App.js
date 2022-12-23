import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css';
import './media.scss';
import Main from './Main/Main';
import DoLogin from './DoLogin/DoLogin';
import Social from './Join/Social';
import Join from './Join/Join';
import Find from './Join/Find';
import Terms from './Join/Terms';
import Setting from './Setting/Setting';
import Home from './Home/Home';
import Write from './Write/Write';
import Board from './Board/Board';
import Create from './Board/Create';
import Edit from './Board/Edit';
import PostView from './Board/PostView';
import PublicRoute from './Lib/PublicRoute';
import PrivateRoute from './Lib/PrivateRoute';
import Friend from './Friend/Friend';
import SCalCreate from './SCAL/SCalCreate';
import SCalSetting from './SCAL/SCalInfo';
import SCalHome from './SCAL/SCalHome';
import SCalWrite from './SCAL/SCalWrite';
import Message from './Message/Message';
import Send from './Message/Send';

function App() {
    return (
        <Router>
            <Routes>
                <Route path='/' element={<PublicRoute><Main /></PublicRoute>}/>
                <Route path='/doLogin' element={<PublicRoute><DoLogin /></PublicRoute>}/>
                <Route path='/social' element={<PublicRoute><Social /></PublicRoute>}/>
                <Route path='/terms' element={<PublicRoute><Terms /></PublicRoute>}/>
                <Route path='/join' element={<PublicRoute><Join /></PublicRoute>}/>
                <Route path='/find' element={<PublicRoute><Find /></PublicRoute>}/>
                <Route path="/setting" element={<PrivateRoute><Setting /></PrivateRoute>}/>
                <Route path="/home" element={<PrivateRoute><Home /></PrivateRoute>}/>
                <Route path="/friend" element={<PrivateRoute><Friend /></PrivateRoute>}/>
                <Route path="/write/:date" element={<PrivateRoute><Write /></PrivateRoute>}/>
                <Route path="/board" element={<PrivateRoute><Board /></PrivateRoute>}/>
                <Route path="/board/write" element={<PrivateRoute><Create /></PrivateRoute>}/>
                <Route path="/board/edit/:no" element={<PrivateRoute><Edit /></PrivateRoute>}/>
                <Route path='/board/post_view/:no' element={<PrivateRoute><PostView /></PrivateRoute>}/>
                <Route path="/scal/create" element={<PrivateRoute><SCalCreate /></PrivateRoute>}/>
                <Route path="/scal/info/:no" element={<PrivateRoute><SCalSetting /></PrivateRoute>}/>
                <Route path="/scal/home/:no" element={<PrivateRoute><SCalHome /></PrivateRoute>}/>
                <Route path="/scal/write/:no/*" element={<PrivateRoute><SCalWrite /></PrivateRoute>}/>
                <Route path="/message" element={<PrivateRoute><Message /></PrivateRoute>}/>
                <Route path="/send" element={<PrivateRoute><Send /></PrivateRoute>}/>
            </Routes>
        </Router> 
    );
}

export default App;
