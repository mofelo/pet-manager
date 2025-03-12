const mongoose = require('mongoose')
const connectToDatabase = require('../config/db')

// 等待数据库连接
connectToDatabase()
  .then(() => {
    // 定义宠物模型
    const petSchema = new mongoose.Schema({
      petId: { type: Number, required: true }, // 宠物ID，自增长
      petName: { type: String, required: true }, // 宠物名称
      petType: { type: String, required: true }, // 宠物类型（如狗、猫等）
      petAge: { type: Number, required: true }, // 宠物年龄
      userName: { type: String, required: true }, // 宠物主人名称
      userPwd: { type: String, required: true }, // 宠物主人密码
      userEmail: { type: String, required: true }, // 宠物主人邮箱
      mobile: { type: String, required: true }, // 宠物主人手机号
      petColor: { type: String, required: true }, // 宠物颜色
      petBreed: { type: String, required: true }, // 宠物品种
      petGender: { type: Number, required: true }, // 性别 0:雌 1: 雄
      ownerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
      }, // 宠物主人ID
      state: {
        type: Number,
        default: 1,
      }, // 宠物状态 0:已领养 1:未领养
      role: {
        type: Number,
        default: 1,
      }, // 用户角色 0:管理员 1:普通用户
      user_type: {
        type: String,
        enum: ['admin', 'user'], // 可以取值为 'admin' 或 'user'
        default: 'user',
      },
      ownerContact: { type: String, required: true }, // 宠物主人联系方式
      vaccinationStatus: { type: String, required: true }, // 疫苗接种情况
      medicalHistory: { type: String, required: true }, // 医疗记录
      createTime: {
        type: Date,
        default: Date.now,
      }, // 创建时间
      lastUpdateTime: {
        type: Date,
        default: Date.now,
      }, // 更新时间
      remark: String, // 备注
    })

    // 定义其他模型
    const PopularPetSchema = new mongoose.Schema({
      petId: String,
      petName: String,
      petType: String,
      furColor: String,
      image: String,
    })

    const AdoptionDynamicSchema = new mongoose.Schema({
      adoptionRecordId: String,
      adopterName: String,
      adoptedPetName: String,
      adoptionTime: String,
    })

    const PetBasicInfoSchema = new mongoose.Schema({
      petId: String,
      petName: String,
      petType: String,
      age: Number,
      gender: String,
      furColor: String,
      city: String,
      entryTimeToShelter: String,
    })

    const PetHealthStatusSchema = new mongoose.Schema({
      petId: String,
      healthDescription: String,
      isSterilized: Boolean,
      vaccinationStatus: String,
    })

    const AdoptablePetSchema = new mongoose.Schema({
      petId: String,
      petName: String,
      petType: String,
      age: Number,
      gender: String,
      furColor: String,
      healthStatus: String,
    })

    const AdoptionApplicationSchema = new mongoose.Schema({
      adoptionRecordId: String,
      adopterId: String,
      petId: String,
      applicationTime: String,
      approvalTime: String,
      actualAdoptionTime: String,
      adoptionStatus: String,
    })

    const AdopterBasicInfoSchema = new mongoose.Schema({
      adopterId: String,
      name: String,
      age: Number,
      gender: String,
      occupation: String,
      contactInfo: String,
      city: String,
      petRaisingExperience: String,
      economicSituation: String,
      livingSituation: String,
      adoptionReason: String,
    })

    const AdoptionHistoryRecordSchema = new mongoose.Schema({
      adoptionRecordId: String,
      petId: String,
      applicationTime: String,
      approvalTime: String,
      actualAdoptionTime: String,
      adoptionStatus: String,
    })

    const LostPetNoticeSchema = new mongoose.Schema({
      posterId: String,
      petName: String,
      petType: String,
      age: Number,
      gender: String,
      furColor: String,
      lostTime: String,
      lostPlace: String,
      contactInfo: String,
      image: String,
    })

    const FoundPetNoticeSchema = new mongoose.Schema({
      posterId: String,
      petName: String,
      petType: String,
      age: Number,
      gender: String,
      furColor: String,
      foundTime: String,
      foundPlace: String,
      contactInfo: String,
      image: String,
    })

    // 定义模型
    const User = mongoose.model('users', petSchema, 'users')
    const PopularPet = mongoose.model('PopularPet', PopularPetSchema)
    const AdoptionDynamic = mongoose.model(
      'AdoptionDynamic',
      AdoptionDynamicSchema
    )
    const PetBasicInfo = mongoose.model('PetBasicInfo', PetBasicInfoSchema)
    const PetHealthStatus = mongoose.model(
      'PetHealthStatus',
      PetHealthStatusSchema
    )
    const AdoptablePet = mongoose.model('AdoptablePet', AdoptablePetSchema)
    const AdoptionApplication = mongoose.model(
      'AdoptionApplication',
      AdoptionApplicationSchema
    )
    const AdopterBasicInfo = mongoose.model(
      'AdopterBasicInfo',
      AdopterBasicInfoSchema
    )
    const AdoptionHistoryRecord = mongoose.model(
      'AdoptionHistoryRecord',
      AdoptionHistoryRecordSchema
    )
    const LostPetNotice = mongoose.model('LostPetNotice', LostPetNoticeSchema)
    const FoundPetNotice = mongoose.model(
      'FoundPetNotice',
      FoundPetNoticeSchema
    )

    // 导出模型
    module.exports = {
      User,
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
    }
  })
  .catch(error => {
    console.error('数据库连接失败，无法定义模型', error)
  })
