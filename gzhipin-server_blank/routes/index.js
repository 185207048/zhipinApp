var express = require('express');
var router = express.Router();

const md5 = require('blueimp-md5');
const {UserModel,ChatModel} = require('../db/models');
const filter = {password: 0}; //查询时过滤指定的数据

router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

/*注册路由 */
router.post('/register',function(req,res){
  const {username,password,type} = req.body;
  UserModel.findOne({username},function(err,user){
    if(user){
      res.send({code:1,msg:'此用户已存在'});

    }else{
      new UserModel({username,password:md5(password),filter,type}).save(function(err,user){
        //生成一个cookie,交给浏览器
        res.cookie('userid',user._id,{maxAge:1000*60*60*24*7});
        res.send({code:0,data:{_id:user._id,username,type}});
      })
      
    }
  })
})

/*登录路由 */
router.post('/login',function(req,res){
  const {username,password} = req.body;
  UserModel.findOne({username,password:md5(password)},filter,function(err,user){
    if(user){
      res.cookie('userid',user._id,{maxAge:1000*60*60*24*7});
      res.send({code:0,data:user});
    }else{
      res.send({code:1,msg:'用户不存在'});
    }
  })
})

/*更新用户信息的路由 */
router.post('/update',function(req,res){
  const userid = req.cookies.userid;
  if(!userid){
    return res.send({code:1,msg:'请先登录'});
  }
  const user = req.body;
  UserModel.findByIdAndUpdate({_id:userid},user,function(error,oldUser){
    if(!oldUser){
      //此时说明浏览器中的cookie有问题(因为虽然有user_id,但是数据库中却没有旧的oldUser),删除cookie
      res.clearCookie('userid');
      res.send({code:1,msg:'请先登录'});
    }else{
      //这里向前台传值的时候需要有用户的每个属性（除了密码），es6中有语法可以合并oldUser和user中的属性，成为全部属性
      const {_id,username,type} = oldUser;
      const data = Object.assign(oldUser,{_id,username,type});
      res.send({code:0,data});
    }
  })

})

 /* 获取用户信息的路由 */
 router.get('/user',function(req,res){
    const userid = req.cookies.userid;
    if(!userid){
      return res.send({code:1,msg:'请先登录'});
    }
    //根据userid查询对应的user
    UserModel.findOne({_id:userid},filter,function(error,user){
      res.send({code:0,data:user});
    })
 });

 /*获取用户列表，根据类型 */
 router.get('/userlist',function(req,res){
   const {type} = req.query;
   UserModel.find({type},filter,function(err,users){
    // console.log(users);  
    res.send({code:0,data:users});
   })
 })

 /*获取当前所有相关聊天信息列表 */
 router.get('/msglist', function(req,res){
   // 获取cookie中的userid
   const userid = req.cookies.userid
   // 查询得到所有user信息: key为user的_id, val为name和header组成的user对象
   UserModel.find(function(err, userDoce){
     const users = {}//对象容器
     userDoce.forEach(doc => {
       users[doc._id] = {username: doc.username, header: doc.header}
     })
    /*const userDoces = userDoce.reduce((userss,user)=>{
      userss[user._id] = {username:user.username,header:user.header}
    },{})*/
     /*
      参数1：查询条件
      参数2：过滤条件
      参数3：回调函数
     */
    ChatModel.find({'$or' : [{from: userid},{to: userid}]}, filter, function(err, chatMsgs){
      res.send({code:0 , data:{users,chatMsgs}})
    })
   })
 })

 /*
 修改指定消息为已读
 */
router.post('/readmsg', function(req,res){
  const from = req.body.from
  const to = req.cookies.userid
  /*
  更新数据库的chat数据
  参数1:查询条件
  参数2
  */
  ChatModel.update({from,to, read: false}, {read:true}, {multi:true} , function(err,doc){
    res.send({code:0 ,data:doc.nModified})
  })
})
module.exports = router;
