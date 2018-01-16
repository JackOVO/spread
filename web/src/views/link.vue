<template>
  <Row>
    <Col span="4">
      <Input
        v-model="keyword"
        icon="search"
        placeholder="名字搜索..." />
    </Col>
    <Col span="20" class-name="text-right">
      <!-- <Button>重置密码</Button> -->
    </Col>
    <Col span="24" style="height: 20px;"></Col>
    <Col span="24">
      <Table
        border
        stripe
        :loading="loading"
        :columns="columns"
        :data="filterData"
        @on-sort-change="changeSort" />
    </Col>
    <Col span="24" style="height: 20px;"></Col>
    <Col span="24" class-name="text-right">
      <Page
        show-total
        show-sizer
        show-elevator
        :total="total"
        :current="current"
        :page-size="pageSize"
        @on-change="changePage"
        @on-page-size-change="changePageSize"
        size="small" />
    </Col>
    <Col span="24" style="height: 20px;"></Col>
  </Row>
</template>
<script>
  import Util from '../libs/util';

  export default {
    data() {

      return {
        loading: false,
        keyword: '',
        current: 1,
        pageSize: 10,
        sort: {
          key: 'created',
          order: 'asc'
        },
        columns: [
          {
            key: 'name',
            title: '名字'
          }, {
            key: 'phone',
            title: '电话'
          }, {
            key: 'style',
            title: '款式'
          }, {
            key: 'size',
            title: '尺码'
          }, {
            key: 'address',
            title: '地址',
            render: (h, {row}) => {
              return `
                ${row.prov} /
                ${row.city} /
                ${row.region} - 
                ${row.address}
              `;
            }
          }, {
            sortable: 'custom',
            sortMethod: 'desc',
            key: 'created',
            title: '创建时间',
            render: (h, {row}) => Util.formatDate(row.created)
          }
        ],
        data: []
      };
    },
    computed: {
      total: function() {
        return this.data
          .filter(link => link.name.indexOf(this.keyword) >= 0).length;
      },
      filterData: function() {
        const {key, order} = this.sort;
        const start = (this.current - 1) * this.pageSize;
        const end = this.current * this.pageSize;

        return this.data
          .filter(link => link.name.indexOf(this.keyword) >= 0)
          .sort(Util.DateSort)
          .slice(start, end);
      }
    },
    methods: {
      changePage: function(page) {
        this.current = page;
      },
      changePageSize: function(size) {
        this.pageSize = size;
      },
      changeSort: function(sort) {
        const {key, order} = sort;
        this.sort = {key, order};
      },
      loadData: function() {
        this.loading = true;
        Util.ajax.get('/link', {}).then(({data}) => {
          this.data = data;
          this.loading = false;
        }).catch(err => {
          this.$Message.error(err);
          this.loading = false;
        });
      },
    },
    created() {
      this.loadData();
    }
  }
</script>