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
            key: 'account',
            width: 120,
            title: '分享账户',
            render: (h, {row}, v) => row.account.alias || row.account.name
          },
          {
            key: 'product',
            width: 100,
            title: '产品名称',
            render: (h, {row}, v) => row.product.name
          },
          {
            key: 'created',
            width: 160,
            title: '来访时间',
            render: (h, {row}) => Util.formatDate(row.created)
          },
          {
            key: 'remain',
            width: 100,
            title: '停留(秒)'
          },
          {
            key: 'clientIP',
            width: 100,
            title: '客户端IP'
          },
          {
            key: 'order',
            width: 100,
            title: '订单',
            align: 'center',
            render: (h, {row}) => {
              return (row.order && row.order._id) ?
              h('Tag', {props: {color: 'green'}}, '以下单') : '未下单';
            }
          },
          {
            key: 'shareLink',
            title: '访问链接'
          }
         ],
         data: []
       };
     },
     computed: {
      filterData: function() {
        return this.data;
      }
    },
    methods: {
      loadData: function() {
        this.loading = true;
        Util.ajax.get('/access/full', {}).then(({data}) => {
          this.data = data;
          this.loading = false;
        }).catch(err => {
          this.$Message.error(err);
          this.loading = false;
        });
      }
    },
    created() {
      this.loadData();
    }
   }
</script>