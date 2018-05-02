<template>
  <Row>
    <Col span="24">
      <Select v-model="selectedValue" @on-change="handleSelectChange">
        <Option
          placeholder="请选择要传播的链接类型"
          v-for="item in linkTemplates"
          :value="item._id"
          :key="item._id">
          <span>{{ item.alias }}</span>
          <span style="float:right;color:#ccc;weigth:bold;">{{ item.type }}</span>
        </Option>
      </Select>
    </Col>
    <Col span="24" style="height: 20px;"></Col>
    <Col span="24">
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
  </Row>
</template>
<script>
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
        linkTemplates: []
      };
    },
    computed: {
      selected: function() {
        return this.linkTemplates.find(({_id}) => this.selectedValue === _id);
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
      handleSelectChange: function(value) {
        const { domain, format } = this.selected;
        const formatV = format.split('/').map(v => {
          return v.replace(/^:(\w+)/, (m, $1) => this[$1] || `错误!${m}`);
        });
        // const selected = this.linkTemplates.find(({_id}) => value === _id);
        // console.info(selected.format);
        this.link = `http://${domain}${formatV.join('/')}`;
      }
    },
    created() {
      this.loadData();
    }
  }
</script>