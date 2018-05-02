<template>
  <Row>
    <Spin fix v-if="uploading">
      <div style="width: 300px;">
        <Progress :percent="progress / 100" status="active"></Progress>
      </div>
    </Spin>
    <Col span="24" class-name="text-right">
      <Upload
        action=""
        :before-upload="handleUpload"
        accept="image/*">
        <Button type="primary" icon="ios-cloud-upload-outline">选择文件上传</Button>
      </Upload>
    </Col>
    <Col span="24">
      <Table
        border
        stripe
        :loading="loading"
        :columns="columns"
        :data="filterData" />
    </Col>
  </Row>
</template>
<script>
import OSS from 'ali-oss';
import BrowserMd5 from 'browser-md5-file';
import moment from 'moment';
import Util from '../libs/util';
moment.locale('zh-cn');

export default {
  data () {
    return {
      file: null,
      uploading: false,
      progress: 0,
      OSSClient: {},
      folder: moment().format('YYYYMMDD/'),

      loading: false,
      columns: [
        {
          type: 'selection',
          width: 60,
          align: 'center'
        },
        {
          key: 'describe',
          title: '描述'
        },
        {
          key: 'size',
          width: 160,
          align: 'right',
          title: 'size/MIME',
          render: (h, {row}) => `${parseInt(row.size / 1024)}KB ${row.mime}`
        },
        {
          key: 'type',
          width: 100,
          title: '类型'
        },
        {
          key: 'created',
          title: '创建时间',
          width: 150,
          render: (h, {row}) => Util.formatDate(row.created)
        },
        {
          key: 'ossPath',
          title: '图片',
          width: 160,
          render: (h, {row}) => {
            if (this.OSSClient.signatureUrl) {
              var signUrl = this.OSSClient.signatureUrl(row.ossPath);
              return h('img', {
                attrs: { src: signUrl },
                style: { 'max-width': '120px', margin: '0 auto' }});
            }
            return row.ossPath;
          }
        }
      ],
      data: []
    }
  },
  created() {
    this.createOSSClient();
    this.loadData();
  },
  computed: {
    filterData: function() {
      return this.data;
    }
  },
  methods: {
    handleUpload (file) {
      if (parseInt(file.size / 1024) > 1024) {
        this.$Message.error('文件大小不能大于 1M', parseInt(file.size / 1024));
        return false;
      }

      this.file = file;
      this.upload();
      return false;
    },
    upload() {
      this.uploading = true;
      const { type, size } = this.file;
      
      BrowserMd5(this.file, (err, md5) => {
        if (err) {
          this.$Message.error('MD5计算错误:' + err);
          this.uploading = false;
        } else {
          // 上传
          var ossPath = `${this.folder}${md5}`;
          this.OSSClient.multipartUpload(ossPath, this.file, {
            progress: p => done => {
              this.progress = p;
              console.info(p);
              if (p === 1) {
                this.uploading = false;
                this.progress = 0;
                this.$Message.success('上传成功!');

                this.createResource(ossPath, type, {md5}, size);
              }
              done();
            },
            meta: {},
            mime: type
          }).then((res) => {
            console.info('OSS Upload ', res);
          }).catch((err) => {
            this.$Message.error('OSS上传错误:' + err);
            this.uploading = false;
          });
        }
      });
    },
    createOSSClient() {
      Util.ajax.get('/token').then(({data}) => {
        this.OSSClient = new OSS.Wrapper(data);
      });
    },
    loadData: function() {
      this.loading = true;
      Util.ajax.get('/resource', {}).then(({data}) => {
        this.data = data;
        this.loading = false;
      }).catch(err => {
        this.$Message.error(err);
        this.loading = false;
      });
    },
    createResource(ossPath, mime, meta, size) {
      this.loading = true;
      const data = {
        mime,
        meta,
        size,
	      ossPath,
	      account: sessionStorage.account_id,
        describe: moment().format('YY/MM/DD h:mm:ss'),
        type: 'PICTURE',
      };
      Util.ajax.post('/resource', data).then((res) => {
        this.$Message.success('资源创建成功!');
        this.loading = false;
        this.loadData();
      }).catch(err => {
        this.$Message.error(err);
        this.loading = false;
      });
    }
  }
}
</script>