const OSS = require('ali-oss');

const config = require('../config/config');
const sts = new OSS.STS(config.oss.ak);

const ReadPolicy = {
  Version: '1',
  Statement: [
    {
      Effect: 'Allow',
      Action: ['oss:GetObject'],
      Resource: ['acs:oss:*:*:jk-wx', 'acs:oss:*:*:jk-wx/*'],
      Condition: {}
    }
  ]
};

const ReadWritePolicy = {
  Version: '1',
  Statement: [
    {
      Effect: 'Allow',
      Action: [
        'oss:GetObject',
        'oss:PutObject',
        'oss:GetObjectAcl',
        'oss:PutObjectAcl'
        // 'oss:DeleteObject',
        // 'oss:ListParts',
        // 'oss:AbortMultipartUpload',
        // 'oss:ListObjects',
        // 'oss:RestoreObject'
      ],
      Resource: ['acs:oss:*:*:jk-wx', 'acs:oss:*:*:jk-wx/*'],
      Condition: {}
    }
  ]
};

module.exports = {
  assumeRoleRead: function() {
    return sts.assumeRole(
      'acs:ram::1286126737392301:role/jkwxobjectfullaccess',
      ReadPolicy,
      15 * 60,
      'session-azhi'
    );
  },
  assumeRoleFull: function() {
    return sts.assumeRole(
      'acs:ram::1286126737392301:role/jkwxobjectfullaccess',
      ReadWritePolicy,
      15 * 60,
      'session-azhi'
    );
  },
  // TODO: OSS 创建公共逻辑抽取
  getOSSClientWithRead: function() {
    //     const client = new OSS({
    //   bucket: 'jk-wx',
    //   region: 'oss-cn-beijing',
    //   accessKeyId: token.credentials.AccessKeyId,
    //   accessKeySecret: token.credentials.AccessKeySecret,
    //   stsToken: token.credentials.SecurityToken
    // });
  }
};
