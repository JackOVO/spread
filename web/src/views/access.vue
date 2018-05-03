<template>
  <Row>
    <Col span="4">
      <Select
        v-model="selectedAccountId"
        @on-change="loadData"
        placeholder="请选择账户">
        <Option value="" key="">全部</Option>
        <Option v-for="item in accounts" :value="item._id" :key="item._id">
          {{ item.name }}
          <span style="float:right;color:#ccc;weigth:bold;">{{ item.alias }}</span>
        </Option>
      </Select>
    </Col>
    <Col span="24" style="margin-top: 20px">
      <Table
        border
        stripe
        :loading="loading"
        :columns="columns"
        :data="filterData" />
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
            key: 'time',
            width: 160,
            title: '来访时间',
            render: (h, {row}) => Util.formatDate(row.time)
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
         page: {
           current: 1,
           total: 0,
           size: 30,
           sizeOpts: [30, 50, 100]
         },
         data: [],
         selectedAccountId: '',
         accounts: []
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
        Util.ajax.get('/access/full', {
          params: {
            offset: (this.page.current - 1) * this.page.size,
            size: this.page.size,
            account: this.selectedAccountId
          }
        }).then(({data: {access, total}}) => {
          this.data = access;
          this.page.total = total;
          this.loading = false;
        }).catch(err => {
          this.$Message.error(err);
          this.loading = false;
        });
      },
      loadAccounts: function() {
        Util.ajax.get('/account', {}).then(({data}) => {
          this.accounts = data;
        }).catch(err => {
          this.$Message.error(err);
        });
      },
      handePageChange: function(current) {
        this.page.current = current;
        this.loadData();
      },
      handePageSizeChange: function(size) {
        this.page.size = size;
        this.loadData();
      }
    },
    created() {
      this.loadData();
      this.loadAccounts();
    }
   }
</script>