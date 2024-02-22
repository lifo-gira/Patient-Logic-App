import AWS from 'aws-sdk';

AWS.config.update({
    region: 'us-west-2',
    credentials: {
      accessKeyId: 'AKIAQQ5O6E7YROLOVJGG',
      secretAccessKey: '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'
    }
  });

export default AWS;