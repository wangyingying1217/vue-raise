import Vue from 'vue'
import Router from 'vue-router'
// 组件路由
import RaiseList from '@/components/RaiseList'
import ProductList from '@/components/ProductList'
import ImageUpload from '@/components/ImageUpload'
import TimeEvolve from '@/components/TimeEvolve'
// 页面路由
import QrCode from '@/page/qrCode/QrCode'
import Login from '@/page/login/Login'
import Register from '@/page/register/Register'
import FindPassword from '@/page/findPassword/FindPassword'
import Raiseshow from '@/page/raiseshow/Raiseshow'
import Search from '@/page/search/Search'
import SearchType from '@/page/searchType/SearchType'
import RaiseInfo from '@/page/raiseInfo/RaiseInfo'
import Details from '@/page/details/Details'
import Comment from '@/page/comment/Comment'
import SupportRecord from '@/page/supportRecord/SupportRecord'
import SupportType from '@/page/supportType/SupportType'
import Evolve from '@/page/evolve/Evolve'
import ProductInfo from '@/page/productInfo/ProductInfo'
import Create from '@/page/create/Create'
import CreateSearch from '@/page/create/children/CreateSearch'
import User from '@/page/user/User'
import Mycollect from '@/page/mycollect/Mycollect'
import Myproduct from '@/page/myproduct/Myproduct'
import Myraise from '@/page/myraise/Myraise'
import Mycoupons from '@/page/mycoupons/Mycoupons'
import Integral from '@/page/mycoupons/children/Integral'
import Discount from '@/page/mycoupons/children/Discount'
import Myorder from '@/page/myorder/Myorder'
import OrderRaise from '@/page/myorder/children/raise'
import OrderProduct from '@/page/myorder/children/product'
import Mynotice from '@/page/mynotice/Mynotice'
import Myinfo from '@/page/myinfo/Myinfo'
import Tel from '@/page/myinfo/children/Tel'
import UserName from '@/page/myinfo/children/userName'
import Email from '@/page/myinfo/children/Email'
import Signature from '@/page/myinfo/children/Signature'
import Address from '@/page/myinfo/children/Address'
import Newaddress from '@/page/myinfo/children/Newaddress'
import Identification from '@/page/myinfo/children/Identification'
import Password from '@/page/myinfo/children/Password'
import Ours from '@/page/ours/Ours'
import Letter from '@/page/letter/Letter'
import Question from '@/page/question/Question'
import Chat from '@/page/chat/Chat'
import Ticket from '@/page/ticket/Ticket'
import Introduce from '@/page/introduce/Introduce'
import Contact from '@/page/contact/Contact'
import Service from '@/page/service/Service'
import Notice from '@/page/notice/Notice'
import Order from '@/page/order/Order'
import OrderDetails from '@/page/orderDetails/OrderDetails'
import ModifyRaise from '@/page/modifyRaise/ModifyRaise'
import ModifySearch from '@/page/modifyRaise/children/CreateSearch'
import Dynamic from '@/page/dynamic/Dynamic'
import Reason from '@/page/reason/Reason'
import ReturnProgress from '@/page/returnProgress/ReturnProgress'
import Logistics from '@/page/logistics/Logistics'
import LogisticsList from '@/page/logisticsList/LogisticsList'
import RefundDetails from '@/page/refundDetails/RefundDetails'
import Exchange from '@/page/exchange/Exchange'
import ExchangeDetails from '@/page/exchangeDetails/ExchangeDetails'
import Success from '@/page/success/Success'
import MessageList from '@/page/messageList/MessageList'
import ImagePreview from '@/page/imagePreview/ImagePreview'

Vue.use(Router)

export default new Router({
  routes: [{
    // 众筹列表页
    path: '/',
    component: Raiseshow,
    children: [{
      path: '/',
      redirect: {
        path: 'hot'
      }
    }, {
      path: 'hot', // 众筹列表页-热门众筹
      component: RaiseList
    }, {
      path: 'his', // 众筹列表页-历史众筹
      component: RaiseList
    }, {
      path: 'pre', // 众筹列表页-预热众筹
      component: RaiseList
    }]
  }, {
    // 二维码
    path: '/qrcode',
    component: QrCode
  }, {
    // 登录
    path: '/login',
    component: Login
  }, {
    // 注册
    path: '/register',
    component: Register
  }, {
    // 找回密码
    path: '/findPassword',
    component: FindPassword
  }, {
    // 众筹展示页
    path: '/raiseInfo/:contentId',
    component: RaiseInfo
  }, {
    // 众筹展示页
    path: '/TimeEvolve',
    component: TimeEvolve
  }, {
    // 众筹详情
    path: '/details/:contentId',
    component: Details
  }, {
    // 众筹评论
    path: '/comment/:contentId',
    component: Comment
  }, {
    // 众筹支持记录
    path: '/supportRecord/:contentId',
    component: SupportRecord
  }, {
    // 众筹支持类型选择
    path: '/supportType/:contentId',
    component: SupportType
  }, {
    // 众筹进展
    path: '/evolve/:contentId',
    component: Evolve
  }, {
    // 商品展示
    path: '/productInfo/:contentId',
    component: ProductInfo
  }, {
    // 订单
    path: '/order/:supportId',
    component: Order,
    children: [{
      path: '/orderAddress', // 地址列表
      redirect: {
        path: '/myinfo/address'
      }
    }]
  }, {
    // 高级搜索
    path: '/search/:type',
    component: Search
  }, {
    // 类型搜索
    path: '/searchType/:type/:value',
    component: SearchType
  }, {
    // 发起众筹
    path: '/create',
    component: Create,
    children: [{
      path: '/create/search', // 我的收藏-众筹
      component: CreateSearch
    }, {
      path: '/ImageClip', // 修改头像
      component: ImageUpload
    }]
  }, {
    // 个人中心
    path: '/person',
    component: User
  }, {
    // 私信列表
    path: '/letter',
    component: Letter
  }, {
    // 私信列表
    path: '/messageList/:type',
    component: MessageList
  }, {
    // 发起提问
    path: '/question/:id',
    component: Question
  }, {
    // 私信
    path: '/chat/:id',
    component: Chat
  }, {
    // 我的收藏
    path: '/mycollect',
    component: Mycollect,
    children: [{
      path: '/',
      redirect: {
        path: '/mycollect/raise'
      }
    }, {
      path: '/mycollect/raise', // 我的收藏-众筹
      component: RaiseList
    }, {
      path: '/mycollect/product', // 发起众筹-商品
      component: ProductList
    }]
  }, {
    // 在线商品
    path: '/myproduct',
    component: Myproduct
  }, {
    // 我的众筹
    path: '/myraise',
    component: Myraise,
    children: [{
      path: '/',
      redirect: {
        path: '/myraise/effective'
      }
    }, {
      path: '/myraise/effective', // 我的众筹-有效众筹
      component: RaiseList
    }, {
      path: '/myraise/history', // 我的众筹-历史众筹
      component: RaiseList
    }]
  }, {
    // 积分优惠券
    path: '/mycoupons',
    component: Mycoupons,
    children: [{
      path: '/',
      redirect: {
        path: '/mycoupons/integral'
      }
    }, {
      path: '/mycoupons/integral', // 积分列表
      component: Integral
    }, {
      path: '/mycoupons/discount', // 优惠券列表
      component: Discount
    }]
  }, {
    // 我的订单
    path: '/myorder',
    component: Myorder,
    children: [{
      path: '/',
      redirect: {
        path: '/myorder/raise'
      }
    }, {
      path: '/myorder/raise', // 我的订单-众筹
      component: OrderRaise,
      children: [{
        path: '/',
        redirect: {
          path: '/myorder/raise/all'
        }
      }, {
        path: '/myorder/raise/:state',
        component: RaiseList
      }]
    }, {
      path: '/myorder/product', // 我的订单-商品
      component: OrderProduct,
      children: [{
        path: '/',
        redirect: {
          path: '/myorder/product/all'
        }
      }, {
        path: '/myorder/product/:state',
        component: ProductList
      }]
    }]
  }, {
    // 活动通告
    path: '/mynotice',
    component: Mynotice
  }, {
    // 个人资料
    path: '/myinfo',
    component: Myinfo,
    children: [{
      path: '/ImageUpload', // 修改头像
      component: ImageUpload
    }, {
      path: '/myinfo/tel', // 修改电话
      component: Tel
    }, {
      path: '/myinfo/userName', // 修改昵称
      component: UserName
    }, {
      path: '/myinfo/email', // 修改电话
      component: Email
    }, {
      path: '/myinfo/signature', // 修改签名
      component: Signature
    }, {
      path: '/myinfo/address', // 地址列表
      component: Address,
      children: [{
        path: '/newaddress/:type', // 添加、修改地址
        component: Newaddress
      }]
    }, {
      path: '/myinfo/identification', // 认证
      component: Identification
    }, {
      path: '/myinfo/password', // 修改密码
      component: Password
    }]
  }, {
    // 关于我们
    path: '/ours',
    component: Ours
  }, {
    // 优惠券
    path: '/ticket/:id',
    component: Ticket
  }, {
    // 公告
    path: '/notice/:id',
    component: Notice
  }, {
    // 修改众筹、修改回报页面
    path: '/modifyRaise/:type/:contentId',
    component: ModifyRaise,
    children: [{
      path: '/ModifyRaise/search', // 我的收藏-众筹
      component: ModifySearch
    }, {
      path: '/Modify/ImageClip', // 修改头像
      component: ImageUpload
    }]
  }, {
    // 发表动态
    path: '/dynamic/:contentId',
    component: Dynamic
  }, {
    // 查看原因
    path: '/reason/:contentId',
    component: Reason
  }, {
    // 回报进展
    path: '/returnProgress/:contentId',
    component: ReturnProgress
  }, {
    // 订单详情
    path: '/orderDetails/:orderCode',
    component: OrderDetails
  }, {
    // 物流列表
    path: '/logisticsList',
    component: LogisticsList
  }, {
    // 物流信息
    path: '/logistics/:orderCode',
    component: Logistics
  }, {
    // 退款详情
    path: '/refundDetails/:orderCode',
    component: RefundDetails
  }, {
    // 换货
    path: '/exchange/:orderCode',
    component: Exchange
  }, {
    // 换货详情
    path: '/exchangeDetails/:orderCode',
    component: ExchangeDetails
  }, {
    // 成功
    path: '/success/:type',
    component: Success
  }, {
    // 公司介绍
    path: '/introduce',
    component: Introduce
  }, {
    // 联系我们
    path: '/contact',
    component: Contact
  }, {
    // 服务条款
    path: '/service',
    component: Service
  }, {
    // 图片原图查看
    path: '/imagePreview/:id/:type/:page',
    component: ImagePreview
  }, {
    // 图片原图查看
    path: '/imagePreview/:id/:type/:page/:itemId',
    component: ImagePreview
  }],
  linkActiveClass: 'act'
})
