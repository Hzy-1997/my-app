 const fields = [{
     key: "camperName",
     label: "营员姓名",
     placeholder: "请输入营员姓名",
     type: "input",
     required: true
   },
   {
     key: "camperGender",
     label: "性别",
     placeholder: "请选择性别",
     type: "picker",
     required: true,
     options: ["男", "女"]
   }, {
     key: "camperAge",
     label: "年龄",
     placeholder: "请输入年龄",
     type: "input",
     required: true
   }, {
     key: "idType",
     label: "证件类型",
     placeholder: "请选择证件类型",
     type: "picker",
     required: true,
     options: ["身份证", "护照", "港澳通行证"]
   }, {
     key: "idCard",
     label: "证件号",
     placeholder: "请输入证件号",
     type: "input",
     required: true
   }, {
     key: "height",
     label: "身高",
     placeholder: "请输入身高",
     type: "input"
   }, {
     key: "weight",
     label: "体重",
     placeholder: "请输入体重",
     type: "input"
   }, {
     key: "way",
     label: "出行方式",
     placeholder: "请选择出行方式",
     type: "picker",
     options: ["高铁", "飞机", "自驾"]
   }, {
     key: "campCategory",
     label: "技能特长",
     placeholder: "请输入技能特长",
     type: "input",

   }, {
     key: "notice",
     label: "注意事项",
     placeholder: "请输入注意事项",
     type: "textarea"
   }, {
     key: "dietaryRestrictions",
     label: "饮食禁忌",
     placeholder: "请输入饮食禁忌",
     type: "input"
   }, {
     key: "parentPhone",
     label: "家长手机号",
     placeholder: "请输入家长手机号",
     type: "input",
     required: true
   }, {
     key: "parentName",
     label: "家长姓名",
     placeholder: "请输入家长姓名",
     type: "input",
     required: true
   }, {
     key: "parentWechat",
     label: "家长微信",
     placeholder: "请输入家长微信",
     type: "input"
   }, {
     key: "parentIdCard",
     label: "家长证件号",
     placeholder: "请输入家长证件号",
     type: "input"
   }, {
     key: "shippingAddress",
     label: "收货地址",
     placeholder: "请输入收货地址",
     type: "textarea"
   },
 ]


 export {
   fields
 };