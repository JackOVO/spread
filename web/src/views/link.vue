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
        keyword: '',
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
            key: 'created',
            title: '创建时间',
            render: (h, {row}) => Util.formatDate(row.created)
          }
        ],
        data: []
      };
    },
    computed: {
      filterData: function() {
        return this.data.filter(link =>
          link.name.indexOf(this.keyword) >= 0);
      }
    },
    methods: {
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