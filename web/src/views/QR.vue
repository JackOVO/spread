<style scoped>
  .qr-wrapper img {
    margin: 0 auto;
  }
</style>

<template>
  <Row>
    <Col>
      <Input
        v-model="domain"
        placeholder="请输入域名">
        <span slot="prepend">衣服地址</span>
        <span slot="prepend">http://</span>
        <span slot="append">/api/link/{{ username }}</span>
      </Input>
    </Col>
    <Col>
      衣服:
      <qr-code :text="address" class="qr-wrapper" style="margin-top: 20px;" />
    </Col>
    <Col>
      <Input
        v-model="domain"
        placeholder="请输入域名">
        <span slot="prepend">镯子地址</span>
        <span slot="prepend">http://</span>
        <span slot="append">/api/link/tmp/{{ username }}</span>
      </Input>
    </Col>
    <Col>
      镯子:
      <qr-code :text="bracelet" class="qr-wrapper" style="margin-top: 20px;" />
    </Col>
  </Row>
</template>
<script>
  import Vue from 'vue'
  import VueQRCodeComponent from 'vue-qrcode-component'
  Vue.component('qr-code', VueQRCodeComponent)

  export default {
    data() {
      return {
        domain: 'domain',
        username: sessionStorage.username
      };
    },
    computed: {
      address: function() {
        return `http://${this.domain}/api/link/${this.username}`
      },
      bracelet: function() {
        return `http://${this.domain}/api/link/tmp/${this.username}`
      }
    }
  }
</script>
