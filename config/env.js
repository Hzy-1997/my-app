/**
 * 微信小程序环境自动判断配置
 * 开发版(develop) -> 开发环境
 * 体验版(trial) -> 测试环境  
 * 正式版(release) -> 生产环境
 */

// 获取当前小程序环境
const getEnvVersion = () => {
  try {
    const accountInfo = wx.getAccountInfoSync();
    // envVersion值: 'develop'（开发版）, 'trial'（体验版）, 'release'（正式版）
    console.log(accountInfo.miniProgram.envVersion)
    return accountInfo.miniProgram.envVersion;
  } catch (error) {
    console.error('获取环境失败，默认使用开发环境', error);
    return 'develop';
  }
};

// 各环境配置
const configs = {
  develop: {
    CRYPTO_SECRET_KEY: 'hezhaoyuSecretKey@admin123',
    // BASE_URL: 'http://127.0.0.1:3000/api',
    BASE_URL: 'https://hezhaoyumvp.cn/api',
    ENV_TYPE: '开发版'
  },

  trial: {
    CRYPTO_SECRET_KEY: 'hezhaoyuSecretKey@admin123',
    BASE_URL: 'https://test-api.example.com',
    ENV_TYPE: '体验版'
  },

  release: {
    CRYPTO_SECRET_KEY: 'hezhaoyuSecretKey@admin123',
    BASE_URL: 'https://hezhaoyumvp.cn/api',
    ENV_TYPE: '正式版'
  }
};

// 获取当前环境配置
const currentEnv = getEnvVersion();
// console.log(`当前运行环境：${ configs.getEnvVersion().ENV_TYPE}`);
export const envConfig = configs[currentEnv] || configs.develop;