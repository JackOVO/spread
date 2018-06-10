<template>
  <Row>
    <Spin fix v-if="uploading">
      <div style="width: 300px;">
        <Progress :percent="progress / 100" status="active"></Progress>
      </div>
    </Spin>
    <Col span="21" class-name="text-right">
      <Button @click="handleResourceUpdate">编辑</Button>
      <Button type="error" @click="handleResourceDelete">删除</Button>
    </Col>
    <Col span="3" class-name="text-right">
      
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
        :data="filterData"
        @on-select="handleTableSelect" />
    </Col>
    <Col span="24" class="text-right" style="margin-top: 20px">
      <Page 
        :total="page.total"
        :page-size="page.size"
        :current="page.current"
        :page-size-opts="page.sizeOpts"
        @on-change="handePageChange"
        @on-page-size-change="handePageSizeChange"
        show-total show-sizer></Page>
    </Col>
    <Col>
      <Modal
        width="380px"
        :title="modal.title"
        ok-text="保存"
        v-model="modal.value"
        :loading="modal.loading"
        @on-ok="handleMondalOK">

        <Form ref="form" label-position="top" :model="form" :rules="rules">
          <FormItem prop="ossPath">
            <Input
              v-model="form.ossPath"
              :disabled="!!form._id"
              placeholder="请输入OSS路径..." />
          </FormItem>

          <FormItem prop="type">
            <Select v-model="form.type" placeholder="请选择资源分类...">
              <Option value="PICTURE">资源(微信名片使用)</Option>
              <Option value="LINK">链接(后续产品使用)</Option>
            </Select>
          </FormItem>
          
          <FormItem prop="describe">
            <Input
              type="textarea"
              v-model="form.describe"
              placeholder="请输入资源描述..." />
          </FormItem>
        </Form>
      </Modal>
    </Col>
  </Row>
</template>
<script>
import BrowserMd5 from 'browser-md5-file';
import moment from 'moment';
import Util from '../libs/util';


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
              const signUrl = this.OSSClient.signatureUrl(row.ossPath);
              return h('img', {
                attrs: { src: signUrl },
                style: { 'max-width': '120px', margin: '0 auto' }});
            }
            return row.ossPath;
          }
        }
      ],
      form: {},
      rules: {},
      modal: {
        value: false,
        title: "标题",
        loading: true
      },
      page: {
        current: 1,
        total: 0,
        size: 10,
        sizeOpts: [10, 20, 30]
      },
      data: []
    }
  },
  created() {
    Util.getOSSClient().then((OSSClient) => {
      this.OSSClient = OSSClient;
    });
    this.loadData();
  },
  computed: {
    filterData: function() {
      return this.data;
    }
  },
  methods: {
    changeLoading() {
      this.modal.loading = false;
      this.$nextTick(() => {
        this.modal.loading = true;
      });
    },
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
    loadData: function() {
      this.loading = true;
      Util.ajax.get('/resource', {
        params: {
          offset: (this.page.current - 1) * this.page.size,
          size: this.page.size,
          // account: this.selectedAccountId
        }
      }).then(({data: {resources, total}}) => {
        this.data = resources;
        this.page.total = total;
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
    },
    handleResourceDelete: function() {
      if (this.selectedRow) {
        this.$Modal.confirm({
          title: '删除资源',
          content: `确认删除 ${this.selectedRow.describe} 资源吗?`,
          onOk: () => {
            Util.ajax.delete(`/resource/${this.selectedRow._id}`).then(({data}) => {
              this.loadData();
              this.$Message.success(data.msg);
            }, (err) => {
              this.$Message.err(err.msg);
            });
          }
        });
      } else {
        this.$Message.info('请选择一项资源');
      }
    },
    handleTableSelect: function(selection, row) {
      this.selectedRow = row;
    },
    handleMondalOK: function() {
      this.$refs.form.validate(valid => {
        if(!valid) {
          return this.changeLoading();
        }

        let path = `/resource/${this.form._id}`;
        let action = 'put';
        let data = {
          type: this.form.type,
          describe: this.form.describe
        };

        Util.ajax[action](path, data).then(({data}) => {
          this.changeLoading();
          this.modal.value = false;
          this.loadData();
          this.$Message.success(data.msg);
        }).catch(err => {
          this.changeLoading();
          this.modal.value = false;
          this.$Message.err(err.msg);
        });
      });
    },
    handleResourceUpdate: function() {
      if (this.selectedRow) {
        this.modal.value = true;
        this.modal.title = '编辑资源信息';
        this.form = this.selectedRow;
      } else {
        this.$Message.info('请选择一项资源');
      }
    },
    handePageChange: function(current) {
      this.page.current = current;
      this.loadData();
    },
    handePageSizeChange: function(size) {
      this.page.size = size;
      this.loadData();
    }
  }
}
</script>