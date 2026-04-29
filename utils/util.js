// import CryptoJS from 'crypto-js';

const CryptoJS = require('crypto-js');
import {
  envConfig
} from "../config/env.js"




const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return `${[year, month, day].map(formatNumber).join('/')} ${[hour, minute, second].map(formatNumber).join(':')}`
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : `0${n}`
}

// 日期格式处理
const formatDate = (dateString, format = true) => {
  let date = "";
  if (dateString instanceof Date) {
    date = new Date(dateString);
  } else if (typeof dateString === 'string' && dateString.trim()) {
    const regex = /(\d{1,2})月(\d{1,2})日/;
    const match = dateString.match(regex);
    if (match) {
      const month = String(match[1]).padStart(2, '0');
      const day = String(match[2]).padStart(2, '0');
      const year = new Date().getFullYear();
      date = new Date(`${year}-${month}-${day}`);
    } else {
      date = new Date(dateString);
    }
  } else {
    date = new Date();
  }

  // 检查日期是否有效
  if (isNaN(date.getTime())) {
    console.error('Invalid date:', date);
    return '';
  }

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');

  if (format) {
    return `${year}-${month}-${day}`;
  } else {
    return `${month}月${day}日`;
  }

}


const cryptoUtil = {
  // 从环境变量获取密钥原文，如果不存在则使用默认值（生产环境应确保设置环境变量）
  getKeyString() {
    return envConfig.CRYPTO_SECRET_KEY;
  },
  // 加密函数 - 使用PBKDF2生成密钥并加密
  encrypt(text) {
    try {
      // 生成随机IV（16字节）
      const iv = CryptoJS.lib.WordArray.random(16);
      // 生成随机盐（16字节）
      const salt = CryptoJS.lib.WordArray.random(16);
      // 使用PBKDF2生成密钥（256位），并将盐传入
      const secretKey = CryptoJS.PBKDF2(this.getKeyString(), salt, {
        keySize: 256 / 32,
        iterations: 1000
      });
      // 使用生成的密钥进行AES加密
      const encrypted = CryptoJS.AES.encrypt(text, secretKey, {
        iv: iv,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7
      });
      // 生成与Node.js兼容的输出格式: salt:iv:encrypted
      const saltHex = salt.toString(CryptoJS.enc.Hex);
      const ivHex = iv.toString(CryptoJS.enc.Hex);
      const encryptedHex = encrypted.ciphertext.toString(CryptoJS.enc.Hex);
      // 返回格式: salt:iv:encrypted
      return saltHex + ':' + ivHex + ':' + encryptedHex;
    } catch (error) {
      console.error('加密失败:', error);
      throw error;
    }
  },

  // 解密函数 - 使用PBKDF2生成密钥并解密
  decrypt(encryptedText) {
    try {
      // 从加密文本中提取salt、iv和encryptedData
      const parts = encryptedText.split(':');
      if (parts.length !== 3) {
        throw new Error('无效的加密数据格式');
      }
      // 将salt和iv转换为WordArray
      const salt = CryptoJS.enc.Hex.parse(parts[0]);
      const iv = CryptoJS.enc.Hex.parse(parts[1]);
      const encrypted = CryptoJS.lib.CipherParams.create({
        ciphertext: CryptoJS.enc.Hex.parse(parts[2])
      });
      // 使用PBKDF2生成密钥
      const secretKey = CryptoJS.PBKDF2(this.getKeyString(), salt, {
        keySize: 256 / 32,
        iterations: 1000
      });
      // 使用生成的密钥解密
      const decrypted = CryptoJS.AES.decrypt(encrypted, secretKey, {
        iv: iv,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7
      });
      // 返回解密后的文本
      return decrypted.toString(CryptoJS.enc.Utf8);
    } catch (error) {
      console.error('解密失败:', error);
      throw error;
    }
  }
}

export {
  formatTime,
  formatDate,
  cryptoUtil
};