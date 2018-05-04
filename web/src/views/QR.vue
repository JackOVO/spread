<template>
  <div>
    <Spin fix v-if="loading" />
    <Row>
      <Col span="24">
        <Select
          @on-change="handleLinkFormatChange"
          placeholder="请选择链接类型">
          <Option
            v-for="item in linkTemplates"
            :value="item._id"
            :key="item._id">
            <span>{{ item.alias }}</span>
            <span style="float:right;color:#ccc;weigth:bold;">{{ item.type }}</span>
          </Option>
        </Select>
      </Col>
    </Row>
    <Row v-if="selectedLinkType === 'PICTURE'" style="margin-top: 20px;">
      <Col span="20">
        <Select
          v-model="resourceId"
          @on-change="handleResourceChange"
          placeholder="请选择要分享的资源...">
          <Option
            v-for="item in resources"
            :value="item._id"
            :key="item._id">
            <span>{{ item.describe }}</span>
            </Option>
        </Select>
      </Col>
      <Col span="4" class="text-right">
        <Button style="width: 100%;" @click="handleAccountExtendSave">保存</Button>
      </Col>
    </Row>
    <br>
    <Row><Col span="24">
      <Input readonly v-model="linkValue" placeholder="目标链接值...">
        <span slot="prepend">http://</span>
      </Input>
    </Col></Row>
    <br>
    <Row>
      <Col span="11">
        <div>链接二维码</div>
        <qr-code :text="QR" class="qr-wrapper"/>
      </Col>
      <Col offset="2" span="11" v-if="selectedLinkType === 'PICTURE'">
        <div>资源预览</div>
        <img :src="signUrl" alt="" style="max-width: 256px; outline: 1px solid red;">
      </Col>
    </Row>
  </div>
</template>
<script>
import Vue from 'vue';
import VueQRCodeComponent from 'vue-qrcode-component';
import Util from '../libs/util';

Vue.component('qr-code', VueQRCodeComponent);

export default {
  data() {
    return {
      loading: false,
      selectedLinkT: {},
      linkTemplates: [],
      resourceId: '',
      selectedResource: {},
      resources: []
    }
  },
  computed: {
    params: function() {
      const o = {
        account: sessionStorage.account_id
      };

      if (this.selectedResource && this.selectedResource.ossPath) {
        o.ossPath = this.selectedResource.ossPath;
      }
      return o;
    },
    linkValue: function() {
      if (this.selectedLinkT.format) {
        const params = this.params;
        const {domain, format} = this.selectedLinkT;
        
        console.log('format', format);
        const formatValues = format.split('/').map(keys => {
          return keys.replace(/^:(\w+)/, (m, $1) => params[$1] || `(无值参数!${m})`);
        });

        return `${domain}${formatValues.join('/')}`;
      }

      return '';
    },
    selectedLinkType: function() {
      return this.selectedLinkT ? this.selectedLinkT.type : null;
    },
    QR: function() {
      console.info('qrv', `http://${this.linkValue}`);
      return `http://${this.linkValue}`;
    },
    signUrl: function() {
      if (this.OSSClient && this.selectedResource.ossPath) {
        console.info(this.OSSClient.signatureUrl(this.selectedResource.ossPath));
        return this.OSSClient.signatureUrl(this.selectedResource.ossPath);
      }
      return '';
    }
  },
  created() {
    this.loadAccount();
    Util.getOSSClient().then((OSSClient) => {
      this.OSSClient = OSSClient;
    });
    this.loadLinkTemplates();
    this.loadResources();
  },
  methods: {
    handleLinkFormatChange(linkId) {
      this.selectedLinkT = this.linkTemplates.find(({_id}) => _id === linkId);

      // TODO: 根据链接类型加载资源, 清空相关选中
      if (this.resourceId) {
        this.handleResourceChange(this.resourceId);
      } else {
        this.selectedResource = {};
      }
    },
    handleResourceChange(resourceId) {
      this.selectedResource = this.resources.find(({_id}) => _id === resourceId) || {};
    },
    handleAccountExtendSave() {
      this.loading = true;
      Util.ajax.put(`/account/${sessionStorage.account_id}/extend`, {
          resourceId: this.resourceId,
          ossPath: this.selectedResource.ossPath
        })
        .then(({data: {account}}) => {
          this.$Message.success('资源变更成功!');
          this.loading = false;
        }).catch(err => {
          this.$Message.error(err);
          this.loading = false;
        });
    },
    loadLinkTemplates() {
      this.loading = true;
      Util.ajax.get('/linkTemplate').then(({data}) => {
        this.linkTemplates = data;
        this.loading = false;
      }).catch(err => {
        this.$Message.error(err);
        this.loading = false;
      });
    },
    loadResources() {
      this.loading = true;
      Util.ajax.get('/resource', {}).then(({data: {resources}}) => {
        this.resources = resources;
        this.loading = false;
      }).catch(err => {
        this.$Message.error(err);
        this.loading = false;
      });
    },
    loadAccount() {
      this.loading = true;
      Util.ajax.get(`/account/${sessionStorage.account_id}/extend`, {})
        .then(({data: {extend}}) => {
          this.resourceId = extend.resourceId;
          this.selectedResource = {
            ossPath: extend.ossPath
          };
          this.loading = false;
        }).catch(err => {
          this.$Message.error(err);
          this.loading = false;
        });
    }
  }
}
</script>

