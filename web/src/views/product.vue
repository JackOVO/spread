<template>
  <Row>
    <Col span="24" class-name="text-right">
      <Button>修改</Button>
      <Button type="primary" @click="createProduct">创建产品</Button>
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
        title="modal.title"
        ok-text="保存"
        v-model="modal.value"
        :loading="modal.loading"
        @on-ok="handleMondalOK">
        
        <Form ref="form" label-position="top" :model="form" :rules="rules">
          <FormItem prop="title">
            <Input v-model="form.title" placeholder="请输入页面标题..." />
          </FormItem>

           <FormItem prop="name">
            <Input v-model="form.name" placeholder="请输入产品名称..." />
          </FormItem>

          <FormItem prop="describe">
            <Input v-model="form.describe" type="textarea" placeholder="请输入产品描述..." />
          </FormItem>

          <FormItem prop="introduce">
            <Input v-model="form.introduce" type="textarea" placeholder="介绍内容定义" />
          </FormItem>

          <FormItem prop="form">
            <Input v-model="form.form" type="textarea" placeholder="表单内容定义" />
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
            key: 'title',
            title: '页面标题'
          },
          {
            key: 'name',
            width: 180,
            title: '名称'
          }
         ],
         data: [],
         form: {},
         rules: {
           title: [{
            required: true,
            message: '请填写产品页面标题!',
            trigger: 'blur'
          }],
          name: [{
            required: true,
            message: '请填写产品名称!',
            trigger: 'blur'
          }]
         },
         modal: {
           value: false,
           title: "产品创建",
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
        Util.ajax.get('/product').then(({data}) => {
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

          Util.ajax.post('/product', {
            title: this.form.title,
            name: this.form.name,
            describe: this.form.describe,
            introduce: this.form.introduce,
            form: this.form.form
          }).then(({data}) => {
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
      createProduct: function() {
        this.modal.value = true;
      }
    },
    created() {
      this.loadData();
    }
   }
</script>