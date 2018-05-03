<template>
  <Row>
    <Col span="24" class-name="text-right">
      <Button type="primary" @click="handleLinkTemplateCreate">创建链接模板</Button>
    </Col>
    <Col span="24" style="height: 20px;"></Col>
    <Col span="24">
      <Table
        border
        stripe
        :loading="loading"
        :columns="columns"
        :data="filterData" />
    </Col>
    <Col>
      <Modal
        width="420px"
        :title="modal.title"
        ok-text="保存"
        :value="modal.value"
        :loading="modal.loading"
        @on-ok="handleMondalOK">
        <Form ref="form" label-position="top" :model="form" :rules="rules">
          <FormItem prop="alias">
            <Input v-model="form.alias" placeholder="请输入链接别名..." />
          </FormItem>
          <FormItem prop="type">
            <Select v-model="form.type" placeholder="请选择链接类型...">
              <Option value="LINK">产品</Option>
              <Option value="PICTURE">微信</Option>
            </Select>
          </FormItem>
          <FormItem prop="domain">
            <Input v-model="form.domain" placeholder="请输入使用的域名..." />
          </FormItem>
          <FormItem prop="format">
            <Input v-model="form.format" placeholder="请输入链接解析格式..." />
          </FormItem>
        </Form>
      </Modal>
    </Col>
  </Row>
</template>

<script>
  import Util from '../libs/util';

   export default {
     data() {
       return {
         loading: false,
         columns: [
           {
            type: 'selection',
            width: 60,
            align: 'center'
          },
          {
            key: 'alias',
            title: '别名'
          },
          {
            key: 'type',
            width: 100,
            title: '类型'
          },
          {
            key: 'domain',
            title: '域名值'
          },
          {
            key: 'format',
            title: '格式'
          }
         ],
         data: [],
         form: {},
         rules: {},
         modal: {
           value: false,
           title: "标题",
           loading: true
         }
       };
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
      loadData: function() {
        this.loading = true;
        Util.ajax.get('/linkTemplate', {}).then(({data}) => {
          this.data = data;
          this.loading = false;
        }).catch(err => {
          this.$Message.error(err);
          this.loading = false;
        });
      },
      handleMondalOK: function() {
        this.$refs.form.validate(valid => {
          if(!valid) {
            return this.changeLoading();
          }

          const data = {
            alias: this.form.alias,
            domain: this.form.domain,
            format: this.form.format,
            type: this.form.type,
            account: sessionStorage.account_id
          };

          Util.ajax.post('/linkTemplate', data).then(({data}) => {
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
      handleLinkTemplateCreate: function() {
        this.form = {};
        this.modal.value = true;
      }
    },
    created() {
      this.loadData();
    }
   }
</script>