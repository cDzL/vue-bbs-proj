import VueRouter from "vue-router";

import Index from "../pages/Index"
import Author from "../pages/Author"
import Suggest from "../pages/Suggest"
import Subscribe from "../pages/Subscribe"
import Message from "../pages/Message"
import Concat from "../pages/Concat"
import User from "../pages/User"
import ArtPage from '../pages/ArtPage'
import ComtPage from '../pages/ComtPage'
import UserMain from '../pages/UserMain'
import UserInfo from '../pages/UserInfo'
import AddArticle from '../pages/AddArticle'
import UserActive from '../pages/UserActive'
import UserComt from '../pages/UserComt'
import UserCollect from '../pages/UserCollect'
import Content from '../pages/Content'
// import Gameing from '../pages/Gaming'
import LoRe from '../pages/LoRe'
import Login from '../components/Login'
import Register from '../components/Register'
// import GameList from '../pages/GameList'
// import RoomList from '../pages/RoomList'
// import GameRoom from '../pages/GameRoom'
import toMe from '../pages/Message/toMe'
import SupportMe from '../pages/Message/supportMe'
import Admin from '../pages/Admin'
import Notice from '../pages/Admin/notice'
import NoticeList from '../pages/Admin/NoticeList'
import PuserList from '../pages/Admin/UserList'
import AdminLogin from '../pages/AdmLogin'
import ArticleList from '../pages/Admin/ArticleList'
import CommentList from '../pages/Admin/CommentList'
import PlateList from '../pages/Admin/PlateList'
import ReportList from '../pages/Admin/ReportList'
import AskFor from '../pages/Admin/AskFor' 
import PersonalMsg from '../pages/Message/personalMsg'
import UserSet from '../pages/UserSet'
import SearchPage from '../pages/Search'
import BgImg from '../pages/Admin/BgImg'
import ForgetPass from '../pages/forgetPass'

export default new VueRouter({
    routes:[
        {   //首页
            path:'/index',
            component:Index,
            children:[
                {
                    path:'author',
                    component:Author,
                    children:[
                        {
                            name:'content',
                            path:'content/:sort',
                            component:Content
                        }
                        
                    ]
                },
                {
                    path:'content',
                    component:Author
                },
                {
                    path:'suggest',
                    component:Suggest
                },
                {
                    path:'subscribe',
                    component:Subscribe
                }
            ]
        },
        {   //管理员登录
            path:'/adminlogin',
            component:AdminLogin
        },
        {   //管理员页面
            path:'/admin',
            component:Admin,
            children:[
                {
                    path:'notice',
                    component:Notice
                },
                {
                    path:'noticelist',
                    component:NoticeList
                },
                {
                    path:'users',
                    component:PuserList
                },
                {
                    path:'articles',
                    component:ArticleList
                },
                {
                    path:'comments',
                    component:CommentList
                },
                {
                    path:'plates',
                    component:PlateList
                },
                {
                    path:'report',
                    component:ReportList
                },
                {
                    path:'request',
                    component:AskFor
                },
                {
                    path:'bgimg',
                    component:BgImg
                }
            ]
        },
        {   //消息页面
            path:'/message',
            component:Message,
            children:[
                {
                    path:'comment',
                    component:toMe
                },
                {
                    path:'supportme',
                    component:SupportMe
                },
                {
                    path:'personalmsg',
                    component:PersonalMsg
                }
            ]
        },
        {   //聊天页面
            name:'concat',
            path:'/concat/:username/:userid',
            component:Concat
        },
        {   //我的页面
            path:'/user',
            component:User,
            children:[
                {
                    name:'userMain',
                    path:'userMain/:userid',
                    component:UserMain
                },
                {
                    name:'userActive',
                    path:'userActive/:userid',
                    component:UserActive
                },
                {
                    name:'userComt',
                    path:'userComt/:userid',
                    component:UserComt
                },
                {
                    name:'userCollect',
                    path:'userCollect/:userid',
                    component:UserCollect
                }
            ]
            
        },
        {   //某张贴的详细页面
            name:'artPage',
            path:'/artPage',
            component:ArtPage,
            children:[
                {
                    name:'commentPage',
                    path:'comment/:aid/:type',
                    component:ComtPage
                }
            ]
        },
        {   //我的信息页面：修改个人信息
            name:'userInfo',
            path:'/userInfo/:userid',
            component:UserInfo
        },
        {   //消息设置页面
            name:'userSet',
            path:'/userSet/:userid',
            component:UserSet
        },
        {   //搜索页面
            name:'search',
            path:'/search',
            component:SearchPage
        },
        {   //发帖，新增帖子
            name:'addArticle',
            path:'/addArticle',
            component:AddArticle
        },
        {   //登录注册页面
            path:'/lore',
            component:LoRe,
            children:[
                {
                    path:'login',
                    component:Login
                },
                {
                    path:'register',
                    component:Register
                }
            ]
        },
        {    //忘记密码重新设置密码
            path:"/setPass",
            component:ForgetPass
        }
        // {   //游戏中的页面
        //     path:'/gaming',
        //     component:Gameing
        // },
        // {   //小游戏页面，显示所有游戏
        //     path:'/gamelist',
        //     component:GameList
        // },
        // {   //房间列表页面
        //     path:'/roomlist',
        //     component:RoomList
        // },
        // {   //房间页面
        //     path:'/gameroom',
        //     component:GameRoom
        // }
    ]
})