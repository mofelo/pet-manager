// 引入 mongoose 库，用于与 MongoDB 数据库进行交互
const mongoose = require('mongoose');
// 引入 Counter 模型，用于处理自增 ID
const Counter = require('./counterSchema');

// 定义宠物模型的 Schema
const petSchema = new mongoose.Schema({
  // 宠物 ID，类型为数字，必须字段，用于唯一标识宠物
  petId: { type: Number, required: true }, 
  // 宠物名称，类型为字符串，必须字段
  petName: { type: String, required: true }, 
  // 宠物类型，如狗、猫等，类型为字符串，必须字段
  petType: { type: String, required: true }, 
  // 宠物年龄，类型为数字，必须字段
  petAge: { type: Number, required: true }, 
  // 宠物主人名称，类型为字符串，必须字段
  userName: { type: String, required: true }, 
  // 宠物主人密码，类型为字符串，必须字段
  userPwd: { type: String, required: true }, 
  // 宠物主人邮箱，类型为字符串，必须字段
  userEmail: { type: String, required: true }, 
  // 宠物主人手机号，类型为字符串，必须字段
  mobile: { type: String, required: true }, 
  // 宠物颜色，类型为字符串，必须字段
  petColor: { type: String, required: true }, 
  // 宠物品种，类型为字符串，必须字段
  petBreed: { type: String, required: true }, 
  // 宠物性别，0 表示雌性，1 表示雄性，类型为数字，必须字段
  petGender: { type: Number, required: true }, 
  // 宠物主人 ID，类型为 MongoDB 的 ObjectId，引用 User 模型，必须字段
  ownerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  }, 
  // 宠物状态，0 表示已领养，1 表示未领养，类型为数字，默认值为 1
  state: {
    type: Number,
    default: 1,
  }, 
  // 用户角色，0 表示管理员，1 表示普通用户，类型为数字，默认值为 1
  role: {
    type: Number,
    default: 1,
  }, 
  // 用户类型，可以取值为 'admin' 或 'user'，类型为字符串，默认值为 'user'
  user_type: {
    type: String,
    enum: ['admin', 'user'], 
    default: 'user',
  },
  // 宠物主人联系方式，类型为字符串，必须字段
  ownerContact: { type: String, required: true }, 
  // 疫苗接种情况，类型为字符串，必须字段
  vaccinationStatus: { type: String, required: true }, 
  // 医疗记录，类型为字符串，必须字段
  medicalHistory: { type: String, required: true }, 
  // 创建时间，类型为日期，默认值为当前时间
  createTime: {
    type: Date,
    default: Date.now,
  }, 
  // 更新时间，类型为日期，默认值为当前时间
  lastUpdateTime: {
    type: Date,
    default: Date.now,
  }, 
  // 备注，类型为字符串
  remark: String, 
});

// 定义热门宠物模型的 Schema
const PopularPetSchema = new mongoose.Schema({
  // 宠物 ID，类型为字符串
  petId: String,
  // 宠物名称，类型为字符串
  petName: String,
  // 宠物类型，类型为字符串
  petType: String,
  // 宠物毛发颜色，类型为字符串
  furColor: String,
  // 宠物图片，类型为字符串
  image: String,
});

// 定义领养动态模型的 Schema
const AdoptionDynamicSchema = new mongoose.Schema({
  // 领养记录 ID，类型为字符串
  adoptionRecordId: String,
  // 领养人姓名，类型为字符串
  adopterName: String,
  // 被领养宠物名称，类型为字符串
  adoptedPetName: String,
  // 领养时间，类型为字符串
  adoptionTime: String,
});

// 定义宠物基本信息模型的 Schema
const PetBasicInfoSchema = new mongoose.Schema({
  // 宠物 ID，类型为字符串
  petId: String,
  // 宠物名称，类型为字符串
  petName: String,
  // 宠物类型，类型为字符串
  petType: String,
  // 宠物年龄，类型为数字
  age: Number,
  // 宠物性别，类型为字符串
  gender: String,
  // 宠物毛发颜色，类型为字符串
  furColor: String,
  // 宠物所在城市，类型为字符串
  city: String,
  // 宠物进入收容所的时间，类型为字符串
  entryTimeToShelter: String,
});

// 定义宠物健康状态模型的 Schema
const PetHealthStatusSchema = new mongoose.Schema({
  // 宠物 ID，类型为字符串
  petId: String,
  // 健康描述，类型为字符串
  healthDescription: String,
  // 是否绝育，类型为布尔值
  isSterilized: Boolean,
  // 疫苗接种情况，类型为字符串
  vaccinationStatus: String,
});

// 定义可领养宠物模型的 Schema
const AdoptablePetSchema = new mongoose.Schema({
  // 宠物 ID，类型为字符串
  petId: String,
  // 宠物名称，类型为字符串
  petName: String,
  // 宠物类型，类型为字符串
  petType: String,
  // 宠物年龄，类型为数字
  age: Number,
  // 宠物性别，类型为字符串
  gender: String,
  // 宠物毛发颜色，类型为字符串
  furColor: String,
  // 宠物健康状态，类型为字符串
  healthStatus: String,
});

// 定义领养申请模型的 Schema
const AdoptionApplicationSchema = new mongoose.Schema({
  // 领养记录 ID，类型为字符串
  adoptionRecordId: String,
  // 领养人 ID，类型为字符串
  adopterId: String,
  // 宠物 ID，类型为字符串
  petId: String,
  // 申请时间，类型为字符串
  applicationTime: String,
  // 审批时间，类型为字符串
  approvalTime: String,
  // 实际领养时间，类型为字符串
  actualAdoptionTime: String,
  // 领养状态，类型为字符串
  adoptionStatus: String,
});

// 定义领养人基本信息模型的 Schema
const AdopterBasicInfoSchema = new mongoose.Schema({
  // 领养人 ID，类型为字符串
  adopterId: String,
  // 领养人姓名，类型为字符串
  name: String,
  // 领养人年龄，类型为数字
  age: Number,
  // 领养人性别，类型为字符串
  gender: String,
  // 领养人职业，类型为字符串
  occupation: String,
  // 领养人联系方式，类型为字符串
  contactInfo: String,
  // 领养人所在城市，类型为字符串
  city: String,
  // 领养人养宠经验，类型为字符串
  petRaisingExperience: String,
  // 领养人经济状况，类型为字符串
  economicSituation: String,
  // 领养人居住情况，类型为字符串
  livingSituation: String,
  // 领养原因，类型为字符串
  adoptionReason: String,
});

// 定义领养历史记录模型的 Schema
const AdoptionHistoryRecordSchema = new mongoose.Schema({
  // 领养记录 ID，类型为字符串
  adoptionRecordId: String,
  // 宠物 ID，类型为字符串
  petId: String,
  // 申请时间，类型为字符串
  applicationTime: String,
  // 审批时间，类型为字符串
  approvalTime: String,
  // 实际领养时间，类型为字符串
  actualAdoptionTime: String,
  // 领养状态，类型为字符串
  adoptionStatus: String,
});

// 定义丢失宠物通知模型的 Schema
const LostPetNoticeSchema = new mongoose.Schema({
  // 发布人 ID，类型为字符串
  posterId: String,
  // 宠物名称，类型为字符串
  petName: String,
  // 宠物类型，类型为字符串
  petType: String,
  // 宠物年龄，类型为数字
  age: Number,
  // 宠物性别，类型为字符串
  gender: String,
  // 宠物毛发颜色，类型为字符串
  furColor: String,
  // 丢失时间，类型为字符串
  lostTime: String,
  // 丢失地点，类型为字符串
  lostPlace: String,
  // 联系人信息，类型为字符串
  contactInfo: String,
  // 宠物图片，类型为字符串
  image: String,
});

// 定义找到宠物通知模型的 Schema
const FoundPetNoticeSchema = new mongoose.Schema({
  // 发布人 ID，类型为字符串
  posterId: String,
  // 宠物名称，类型为字符串
  petName: String,
  // 宠物类型，类型为字符串
  petType: String,
  // 宠物年龄，类型为数字
  age: Number,
  // 宠物性别，类型为字符串
  gender: String,
  // 宠物毛发颜色，类型为字符串
  furColor: String,
  // 找到时间，类型为字符串
  foundTime: String,
  // 找到地点，类型为字符串
  foundPlace: String,
  // 联系人信息，类型为字符串
  contactInfo: String,
  // 宠物图片，类型为字符串
  image: String,
});

// 根据 petSchema 创建 Pet 模型
const Pet = mongoose.model('Pet', petSchema);
// 根据 PopularPetSchema 创建 PopularPet 模型
const PopularPet = mongoose.model('PopularPet', PopularPetSchema);
// 根据 AdoptionDynamicSchema 创建 AdoptionDynamic 模型
const AdoptionDynamic = mongoose.model('AdoptionDynamic', AdoptionDynamicSchema);
// 根据 PetBasicInfoSchema 创建 PetBasicInfo 模型
const PetBasicInfo = mongoose.model('PetBasicInfo', PetBasicInfoSchema);
// 根据 PetHealthStatusSchema 创建 PetHealthStatus 模型
const PetHealthStatus = mongoose.model('PetHealthStatus', PetHealthStatusSchema);
// 根据 AdoptablePetSchema 创建 AdoptablePet 模型
const AdoptablePet = mongoose.model('AdoptablePet', AdoptablePetSchema);
// 根据 AdoptionApplicationSchema 创建 AdoptionApplication 模型
const AdoptionApplication = mongoose.model('AdoptionApplication', AdoptionApplicationSchema);
// 根据 AdopterBasicInfoSchema 创建 AdopterBasicInfo 模型
const AdopterBasicInfo = mongoose.model('AdopterBasicInfo', AdopterBasicInfoSchema);
// 根据 AdoptionHistoryRecordSchema 创建 AdoptionHistoryRecord 模型
const AdoptionHistoryRecord = mongoose.model('AdoptionHistoryRecord', AdoptionHistoryRecordSchema);
// 根据 LostPetNoticeSchema 创建 LostPetNotice 模型
const LostPetNotice = mongoose.model('LostPetNotice', LostPetNoticeSchema);
// 根据 FoundPetNoticeSchema 创建 FoundPetNotice 模型
const FoundPetNotice = mongoose.model('FoundPetNotice', FoundPetNoticeSchema);

// 导出所有定义好的模型，以便在其他文件中使用
module.exports = {
  Pet,
  PopularPet,
  AdoptionDynamic,
  PetBasicInfo,
  PetHealthStatus,
  AdoptablePet,
  AdoptionApplication,
  AdopterBasicInfo,
  AdoptionHistoryRecord,
  LostPetNotice,
  FoundPetNotice,
};

