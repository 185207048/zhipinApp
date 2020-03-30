/*
    使用mongoose操作mongodb测试文件
    1.连接数据库
        引入mongoose
        连接指定数据库(URL只有数据库是变化的)
        获取连接对象
        绑定连接完成的监听(用来提示连接成功)
    
    2.得到对应特定集合的model
        字义Schema(描述文档结构)
        定义Model(与集合对应，可以操作集合)
    
    3.通过model或其实例对集合数据进行CRUD操作
        通过model实例的save()添加数据
        通过model的find()/findOne()查询多个或一个数据
        ....
*/

const md5 = require('blueimp-md5');
const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/gzhipin_test');
const conn = mongoose.connection;
conn.on('connected',function(){
    console.log('数据库连接成功');

})

const userSchema = mongoose.Schema({
    username:{type:String,required:true},
    password:{type:String,required:true},
    type:{type:String,required:true},

})
const UserModel = mongoose.model('user',userSchema);

function testSave(){
    const user = {
        username:'xixi',
        password:md5('123123'),
        type:'dashen'
    }
    const userModel = new UserModel(user);
    userModel.save(function(err,user){
        console.log('save',err,user);
    })
}
testSave();