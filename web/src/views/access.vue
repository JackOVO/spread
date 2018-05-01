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
            key: 'accountAlias',
            width: 120,
            title: '分享账户'
          },
          {
            key: 'productName',
            width: 100,
            title: '产品名称'
          },
          {
            key: 'created',
            width: 160,
            title: '来访时间',
            render: (h, {row}) => Util.formatDate(row.created)
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
        Util.ajax.get('/access', {}).then(({data}) => {
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