## vue-home

>技术点

用vue社区提供的API，基于vue+vue-cli+vue-router+vue-router+vue-resource+webpack开发的众筹项目

css用less，flex布局，rem做移动端适配。

用localStorage做缓存

### 安装运行

``` bash
# install dependencies
npm install

# serve with hot reload at localhost:8080
npm run dev

# build for production with minification
npm run build

# build for production and view the bundle analyzer report
npm run build --report
```
* 注意`npm run dev` 之后 默认浏览器打开的是http://localhost:8082  请换成http://192.168.8.173:8082/（ip与后台绑定，更换电脑请更改后台允许请求的地址）

### 准备开发环境

* $ npm install -g vue-cli
* $ vue init webpack vue-home

```
? Project name vue-home
? Project description vue-home
? Author afei
? Vue build standalone
? Install vue-router? Yes
? Use ESLint to lint your code? No
? Setup unit tests with Karma + Mocha? No
? Setup e2e tests with Nightwatch? No
```

* $ cd vue-home
* $ npm install
* $ npm run dev

等写完项目后 打包上线
* $ npm run build

>如果你电脑的8080端口被占用，请congfig/index.js中找到`port: 8082`修改成8081或者其他可用的端口


### 开始动手

#### 项目结构

```
├── build
│   ├── build.js
│   ├── check-versions.js
│   ├── dev-client.js
│   ├── dev-server.js         
│   ├── utils.js          
│   ├── vue-loader.conf.js          
│   ├── webpack.base.conf.js          
│   ├── webpack.dev.conf.js         
│   └── webpack.prod.conf.js          
├── config          
│   ├── dev.env.js          
│   ├── index.js          
│   └── prod.env.js         
├── dist                                      //等写完项目后 $ npm run build 的打包文件
│   ├── index.html                  
│   └── static                  
├── index.html                                //首页入口文件
├── node_modules                  
├── package.json                            
├── src                 
│   ├── App.vue                               //项目入口文件
│   ├── main.js                               //核心文件 在这里引入了Muse UI 时间过滤器
│   ├── image                                 //项目中用到的图片
│   │                 
│   ├── style                                 //静态样式
│   │   ├── base.less                         //公共样式
│   │   └── reset.css                         //默认样式重置       
│   │                 
│   ├── service                               //公共js文件
│   │   ├── city.js                           //底部nav组件
│   │   └── viewport_rem.js                   //定义视口和rem单位
│   │                 
│   ├── components                            //组件
│   │   ├── loadmore                          
│   │   │   ├── index.js                      //注册全局组件
│   │   │   └── LoadMore.vue                  //加载更多组件
│   │   │                 
│   │   ├── tip                         
│   │   │   ├── index.js                      //注册全局组件
│   │   │   └── tip.vue                       //提示框组件
│   │   │             
│   │   ├── AddressList.vue                   //选择省市区地址列表组件
│   │   ├── Confirm.vue                       //选择弹出框组件
│   │   ├── Prompt.vue                        //输入弹出框组件
│   │   ├── Coupon.vue                        //优惠券组件
│   │   ├── Tabmenu.vue                       //Tab切换组件
│   │   ├── FooterBar.vue                     //底部nav组件
│   │   ├── Nodata.vue                        //无数据时提示组件
│   │   ├── Pay.vue                           //支付组件
│   │   ├── ProductList.vue                   //商品列表组件
│   │   ├── RaiseList.vue                     //众筹列表组件
│   │   ├── TimeEvolve.vue                    //发展列表组件
│   │   ├── ImageUpload.vue                   //图片剪裁组件
│   │   └── Upload.vue                        //上传视频图片组件
│   │                 
│   ├── pages                                 //页面         
│   │   ├── qrCode                            //二维码扫描关注公众号
│   │   │   └── QrCode.vue
│   │   │       
│   │   ├── login                             //登录
│   │   │   └── Login.vue
│   │   │
│   │   ├── register                          //注册（暂时废止）
│   │   │   └── Register.vue
│   │   │                  
│   │   ├── findPassword                      //找回密码
│   │   │   └── FindPassword.vue        
│   │   │       
│   │   ├── raiseshow                         //众筹列表
│   │   │   └── Raiseshow.vue
│   │   │         
│   │   ├── search                            //众筹高级搜索
│   │   │   └── Search.vue
│   │   │         
│   │   ├── searchType                        //搜索同类型的众筹
│   │   │   └── SearchType.vue
│   │   │  
│   │   ├── raiseInfo                         //项目信息
│   │   │   └── RaiseInfo.vue
│   │   │    
│   │   ├── question                          //向他提问
│   │   │   └── Question.vue
│   │   │  
│   │   ├── details                           //项目详情
│   │   │   └── Details.vue          
│   │   │  
│   │   ├── comment                           //项目评论
│   │   │   └── Comment.vue         
│   │   │          
│   │   ├── supportRecord                     //支持记录
│   │   │   └── SupportRecord.vue
│   │   │         
│   │   ├── evolve                            //项目动态
│   │   │   └── Evolve.vue
│   │   │         
│   │   ├── supportType                       //支持项
│   │   │   └── SupportType.vue
│   │   │                                
│   │   ├── order                             //下订单
│   │   │   └── Order.vue       
│   │   │         
│   │   ├── success                           //订单成功
│   │   │   └── Success.vue
│   │   │        
│   │   ├── create                            //发起众筹
│   │   │   ├── Create.vue                    
│   │   │   └── children          
│   │   │       ├── PresonInfo.vue            //个人信息
│   │   │       ├── RaiseInfo.vue             //众筹信息
│   │   │       ├── Describe.vue              //众筹描述
│   │   │       ├── Return.vue                //回报信息
│   │   │       └── CreateSearch.vue          //在线商品
│   │   │         
│   │   ├── user                              //个人中心
│   │   │   └── User.vue
│   │   │                
│   │   ├── informList                        //信封列表页面
│   │   │   └── InformList.vue
│   │   │         
│   │   ├── letter                            //私信列表
│   │   │   └── Letter.vue
│   │   │               
│   │   ├── messageList                       //物流服务、支持消息、动态通知、项目通知列表
│   │   │   └── MessageList.vue
│   │   │        
│   │   ├── chat                              //聊天
│   │   │   └── Chat.vue          
│   │   │                  
│   │   ├── mycollect                         //我的收藏
│   │   │   └── Mycollect.vue
│   │   │         
│   │   ├── myproduct                         //在线商品
│   │   │   └── Myproduct.vue
│   │   │         
│   │   ├── myraise                           //我的众筹
│   │   │   └── Myraise.vue
│   │   │         
│   │   ├── reason                            //众筹审核未通过原因
│   │   │   └── Reason.vue
│   │   │         
│   │   ├── modifyRaise                       //修改众筹、修改回报
│   │   │   ├── ModifyRaise.vue                    
│   │   │   └── children          
│   │   │       ├── PresonInfo.vue            //个人信息
│   │   │       ├── RaiseInfo.vue             //众筹信息
│   │   │       ├── Describe.vue              //众筹描述
│   │   │       ├── Return.vue                //回报信息
│   │   │       └── CreateSearch.vue          //在线商品
│   │   │         
│   │   ├── returnProgress                    //回报进展
│   │   │   └── ReturnProgress.vue
│   │   │         
│   │   ├── dynamic                           //创建项目动态
│   │   │   └── Dynamic.vue          
│   │   │         
│   │   ├── mycoupons                         //我的卡券
│   │   │   ├── Mycoupons.vue
│   │   │   └── children          
│   │   │       ├── Discount.vue              //优惠券
│   │   │       └── Integral.vue              //积分
│   │   │        
│   │   ├── ticket                            //积分兑换券详情
│   │   │   └── Ticket.vue
│   │   │         
│   │   ├── myorder                           //我的订单
│   │   │   ├── Myorder.vue
│   │   │   └── children          
│   │   │       ├── raise.vue                 //众筹订单
│   │   │       └── product.vue               //商品订单
│   │   │
│   │   ├── orderDetails                      //订单详情
│   │   │   └── OrderDetails.vue
│   │   │         
│   │   ├── refundDetails                     //退款详情
│   │   │   └── RefundDetails.vue
│   │   │         
│   │   ├── exchange                          //换货
│   │   │   └── Exchange.vue
│   │   │         
│   │   ├── exchangeDetails                   //换货详情
│   │   │   └── ExchangeDetails.vue
│   │   │        
│   │   ├── logisticsList                     //物流列表
│   │   │   └── LogisticsList.vue
│   │   │   
│   │   ├── logistics                         //物流详情
│   │   │   └── Logistics.vue
│   │   │         
│   │   ├── mynotice                          //活动公告
│   │   │   └── Mynotice.vue
│   │   │         
│   │   ├── notice                            //公告详情
│   │   │   └── Notice.vue
│   │   │         
│   │   ├── myinfo                            //个人信息
│   │   │   ├── Myinfo.vue                    
│   │   │   └── children          
│   │   │       ├── UserName.vue              //修改用户名
│   │   │       ├── Email.vue                 //修改邮箱
│   │   │       ├── Tel.vue                   //修改电话
│   │   │       ├── Signature.vue             //修改个性签名
│   │   │       ├── Identification.vue        //个人、企业认证
│   │   │       ├── Address.vue               //收货地址
│   │   │       └── Newaddress.vue            //新增收货地址
│   │   │
│   │   ├── ours                              //关于我们
│   │   │   └── Ours.vue
│   │   │         
│   │   ├── introduce                         //公司简介
│   │   │   └── introduce.vue
│   │   │         
│   │   ├── contact                           //联系我们
│   │   │   └── Contact.vue         
│   │   │           
│   │   ├── service                           //服务条款
│   │   │   └── Service.vue
│   │   │
│   │   └── imagePreview                      //图片预览
│   │       └── ImagePreview.vue
│   │         
│   └── router                                //路由与组件配置
│       └── index.js                  
└── static  
```
#### 项目注意点

* 请求的参数以及返回值请参照后台写的接口文档

* 本地存储的`state`是此公众号的接口所属类别（分为众筹公众号、微书城电子书公众号、微书城纸质书公众号、微书城app）

* 页面中的`apiURL`字段为跨域请求的地址前缀（因为所有的请求地址都是在raise下的，所以在请求前缀中加入了`raise`）

* 页面中的`id`字段为用户的微信`unionId`（用户的唯一标示）

* 页面中的`contentId`字段为此项目的id

* 页面中的`show`字段是控制页面的渲染（数据请求之后在进行渲染，否则会造成刚进入页面时没有数据）

* 页面中的`info`字段一般都是用来存储页面刚刚加载的信息（组件中用来传递信息）

* 页面中的`redirectUrl`字段一般表单提交之后跳转的链接

* 页面中计算属性`height`字段一般都是可是区域的高度（用来设置最小高度）

* 页面中的`page`字段用来表示页面加载到第几页（分页中使用）

* 页面中的`confirmInfo`字段为调用confirm组件传递的信息，其中`title`为标题、`name`为提示

* 页面中的`confirmState`字段控制confirm组件是否显示

* 页面中的`tip`字段为调用tip组件传递的信息

* 页面中的`loadState`字段为调用loadmore组件传递的信息（每次请求的控制开关 true-加载数据 false-加载完成）

* 页面中的`loadBoff`字段为调用loadmore组件传递的信息（是否还有数据可以加载  true-有数据 false-没有数据）

* 页面中的`getCustomers`方法都是用来进入页面完后获取数据（参数都存在时再执行）

* `路由`和`用户ID`发生变化时执行getCustomers方法，页面数据进行重新加载（以为用户id是异步加载过来的，一般执行getCustomers方法时需要判断用户id是否获取到）

* 页面中`loadState`字段发生变化时判断其值为true时请求服务器加载数据，加载完成如果数据存在则将数据存在相应字段中然后将`loadState`状态改为false，如果数据不存在直接将`loadBoff`改为false

* 修改回报和修改众筹是一个页面，修改众筹和发起众筹基本一样，只是发起众筹进入页面中的信息是从本地存储中获得或者为空，而修改众筹页面的信息是从服务器请求过来的，其他并无异议

* 发起众筹页面内容太长，为了便于维护拆成四个组件和一个在线商品选择的组件，页面中存储的信息发生变化是会进行本地存储，方便下次进入时获取相应的数据（存储时间为2天），每个input控制一个相应的字段，字段的invalid属性为是否校验通过（值为false是代表通过校验 否则为未通过校验）,字段的value属性为用户输入的文本,组件向下的切换要校验通过才能切换的
