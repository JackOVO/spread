<template>
  <Row>
    <Col span="24">
      <Select v-model="selectedValue" @on-change="handleSelectChange" placeholder="请选择要传播的链接类型">
        <Option
          v-for="item in linkTemplates"
          :value="item._id"
          :key="item._id">
          <span>{{ item.alias }}</span>
          <span style="float:right;color:#ccc;weigth:bold;">{{ item.type }}</span>
        </Option>
      </Select>
    </Col>
    <Col v-if="RRR" span="24" style="margin-top: 20px;">
      <Select v-model="selectedossPath" @on-change="handleSelectossPathChange" placeholder="请选择要分享的资源">
        <Option
          v-for="item in resources"
          :value="item.ossPath"
          :key="item._id">
          <span>{{ item.describe }}</span>
          <!-- <span style="float:right;color:#ccc;weigth:bold;">{{ item.type }}</span> -->
        </Option>
      </Select>
    </Col>
    <Col span="24" style="margin-top: 20px;">
      <Input
        readonly
        v-model="link"
        placeholder="请输入域名">
        <span slot="prepend">http://</span>
        <!-- <span slot="append">/api/link/{{ username }}</span> -->
      </Input>
    </Col>
    <Col span="12">
      <qr-code :text="link" class="qr-wrapper" style="margin-top: 20px;" />
    </Col>
    <Col span="12" class="full-right" style="margin-top: 20px;">
      <img :src="signUrl" style="max-height: 256px;" />
    </Col>
  </Row>
</template>
<script>
  import OSS from 'ali-oss';
  import Vue from 'vue';
  import VueQRCodeComponent from 'vue-qrcode-component';
  import Util from '../libs/util';
  Vue.component('qr-code', VueQRCodeComponent)

  export default {
    data() {
      return {
        account: sessionStorage.account_id,
        link: 'test',
        selectedValue: '',
        selectedossPath: '',
        resources: [],
        linkTemplates: [],
        OSSClient: {},
        signUrl: ''
      };
    },
    computed: {
      selected: function() {
        return this.linkTemplates.find(({_id}) => this.selectedValue === _id);
      },
      RRR: function() {
        return this.selected && (this.selected.type === 'PICTURE');
      }
     /*  address: function() {
        return `http://${this.domain}/api/link/${this.username}`
      },
      bracelet: function() {
        return `http://${this.domain}/api/link/tmp/${this.username}`
      } */
    },
    methods: {
      loadData: function() {
        Util.ajax.get('/linkTemplate/').then(({data}) => {
          this.linkTemplates = data;
        }).catch(err => {
          this.$Message.error(err);
        });
      },
      loadResource: function() {
        this.loading = true;
        Util.ajax.get('/resource', {}).then(({data}) => {
          this.resources = data;
          this.loading = false;
        }).catch(err => {
          this.$Message.error(err);
          this.loading = false;
        });
     },
      handleSelectChange: function(value) {
        const { domain, format } = this.selected;
        const formatV = format.split('/').map(v => {
          return v.replace(/^:(\w+)/, (m, $1) => this[$1] || `错误!${m}`);
        });
        // const selected = this.linkTemplates.find(({_id}) => value === _id);
        // console.info(selected.format);
        this.ossPath = '';
        this.selectedossPath = '';
        this.signUrl = '';
        this.link = `http://${domain}${formatV.join('/')}`;
      },
      handleSelectossPathChange: function(value) {
        const { domain, format } = this.selected;
        this.ossPath = value;
        const formatV = format.split('/').map(v => {
          return v.replace(/^:(\w+)/, (m, $1) => this[$1] || `错误!${m}`);
        });
        // const selected = this.linkTemplates.find(({_id}) => value === _id);
        // console.info(selected.format);
        this.signUrl = this.OSSClient.signatureUrl(value);
        this.link = `http://${domain}${formatV.join('/')}`;
      },
      createOSSClient() {
        Util.ajax.get('/token').then(({data}) => {
          this.OSSClient = new OSS.Wrapper(data);
        });
      },
    },
    created() {
      this.loadData();
      this.loadResource();
      this.createOSSClient();
    }
  }
</script>