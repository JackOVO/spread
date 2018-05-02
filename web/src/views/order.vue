<template>
  <Row>
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
        width="380px"
        :title="modal.title"
        ok-text="保存"
        :value="modal.value"
        :loading="modal.loading"
        @on-ok="handleMondalOK" />
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
            key: 'customerName',
            width: 100,
            title: '客户姓名'
          },
          {
            key: 'customerPhone',
            width: 120,
            title: '客户电话'
          },
          {
            key: 'customerAddress',
            title: '地址信息',
            render: (h, {row}) => row.customerAddress.join('/')
          },
          {
            key: 'product',
            title: '商品'
          },
          {
            key: 'model',
            title: '型号'
          },
          {
            key: 'status',
            width: 80,
            title: '状态'
          },
          {
            key: 'account',
            title: '分享人'
          },
          {
            key: 'created',
            title: '创建时间',
            width: 150,
            render: (h, {row}) => Util.formatDate(row.created)
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
        Util.ajax.get('/order', {}).then(({data}) => {
          this.data = data;
          this.loading = false;
        }).catch(err => {
          this.$Message.error(err);
          this.loading = false;
        });
      },
      handleMondalOK: function() {
        // this.$refs.form.validate(valid => {
        //    if(!valid) {
        //     return this.changeLoading();
        //   }

        //   Util.ajax.post('/product', {
        //     title: this.form.title,
        //     name: this.form.name,
        //     describe: this.form.describe,
        //     introduce: this.form.introduce,
        //     form: this.form.form
        //   }).then(({data}) => {
        //     this.changeLoading();
        //     this.modal.value = false;
        //     this.loadData();
        //     this.$Message.success(data.msg);
        //   }).catch(err => {
        //     this.changeLoading();
        //     this.modal.value = false;
        //     this.$Message.err(err.msg);
        //   });
        // });
      }
    },
    created() {
      this.loadData();
    }
   }
</script>