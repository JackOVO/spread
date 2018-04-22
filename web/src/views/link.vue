<template>
  <Row :gutter="10">
    <Col span="4">
      <Input
        v-model="keyword"
        icon="search"
        placeholder="名字搜索..." />
    </Col>
    <Col span="20">
      <Select v-model="selected" @on-change="loadData" style="width:120px" placeholder="请选择分享人">
        <Option v-for="item in accountList" :value="item.value" :key="item.value">{{ item.label }}</Option>
      </Select>
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
        :page-size-opts="[10, 50, 100]"
        @on-change="changePage"
        @on-page-size-change="changePageSize"
        size="small" />
    </Col>
    <Col span="24" style="height: 20px;"></Col>
  </Row>
</template>
<script>
  import Util from '../libs/util';
  const role = sessionStorage.role;
  const username = sessionStorage.username;

  export default {
    data() {
      const adminColumns = [{
        key: 'name',
        title: '序号',
        width: '80px',
        render: (h, {index}) => index
      }, {
        key: 'name',
        title: '名字',
        width: '80px'
      }, {
        key: 'phone',
        title: '电话',
        width: '150px'
      }, {
        key: 'style',
        title: '款式',
        width: '80px'
      }, {
        key: 'size',
        title: '尺码',
        width: '80px'
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
        key: 'sharer',
        title: '分享人',
        width: '100px'
      }, {
        sortable: 'custom',
        sortMethod: 'desc',
        key: 'created',
        title: '创建时间',
        width: '150px',
        render: (h, {row}) => Util.formatDate(row.created)
      }];

      const commonCols = adminColumns.concat();
      commonCols.splice(4, 1);


      return {
        loading: false,
        keyword: '',
        selected: role === 'ADMIN' ? '' : username,
        current: 1,
        pageSize: 100,
        sort: {
          key: 'created',
          order: 'desc'
        },
        columns: role === 'ADMIN' ? adminColumns : commonCols,
        data: [],
        accounts: []
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
          .sort((ra, rb) => {
            return Util.dateSort(ra[key], rb[key], order);
          })
          .slice(start, end);
      },
      accountList: function() {
        if (role !== 'ADMIN') {
          return [{ label: username, value: username }];
        }

        const online = this.accounts.map(item => ({
          label: item.username,
          value: item.username
        }));

        return [{label: '全部', value: ''}].concat(online);
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
        Util.ajax.get('/link', {params: { sharer: this.selected }}).then(({data}) => {
          this.data = data;
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
      }
    },
    created() {
      this.loadData();
      if (role === 'ADMIN') {
        this.loadAccounts();
      }
    }
  }
</script>