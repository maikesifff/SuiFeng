<template>
  <div class="order-customer-page">
    <div class="page-header">
      <div class="header-title">客户订单管理</div>
      <div class="header-subtitle">查看和管理所有客户订单</div>
    </div>

    <div class="search-box">
      <div class="search-row">
        <div class="search-group">
          <div class="search-label">搜索订单</div>
          <div class="search-input-wrapper">
            <div class="search-icon"></div>
            <input 
              type="text" 
              v-model="searchQuery"
              class="search-input"
              placeholder="输入订单ID、货主名称或产品名称"
            >
          </div>
        </div>
        <div class="filter-group">
          <div class="filter-label">订单状态</div>
          <select v-model="statusFilter" class="filter-select">
            <option value="">全部状态</option>
            <option value="创建">创建</option>
            <option value="处理中">处理中</option>
            <option value="已发货">已发货</option>
            <option value="已完成">已完成</option>
            <option value="已取消">已取消</option>
            <option value="退货中">退货中</option>
          </select>
        </div>
      </div>
    </div>

    <div class="order-table">
      <div class="table-header">
        <div class="header-cell">订单ID</div>
        <div class="header-cell">货主名称</div>
        <div class="header-cell">产品名称</div>
        <div class="header-cell">数量</div>
        <div class="header-cell">下单时间</div>
        <div class="header-cell">订单状态</div>
        <div class="header-cell">操作</div>
      </div>
      <div v-for="order in filteredOrders" 
           :key="order.order_id" 
           class="table-row">
        <div class="table-cell">{{ order.order_id }}</div>
        <div class="table-cell">{{ order.Shipper?.shipper_name || '未知货主' }}</div>
        <div class="table-cell">{{ order.Inventory?.Product?.product_name || '未知产品' }}</div>
        <div class="table-cell">{{ order.quantity }}</div>
        <div class="table-cell">{{ order.created_at }}</div>
        <div class="table-cell">
          <div class="status-badge" :class="getStatusClass(order.status)">
            {{ getStatusText(order.status) }}
          </div>
        </div>
        <div class="table-cell">
          <div class="action-buttons">
            <button class="action-button view" @click="viewOrder(order)">
              <div class="view-icon"></div>
              <span>查看</span>
            </button>
            <button v-if="order.status === '创建'" 
                    class="action-button process" 
                    @click="processOrder(order)">
              <div class="process-icon"></div>
              <span>处理</span>
            </button>
            <button v-if="order.status === '处理中'" 
                    class="action-button ship" 
                    @click="shipOrder(order)">
              <div class="ship-icon"></div>
              <span>发货</span>
            </button>
          </div>
        </div>
      </div>
    </div>

    <div class="pagination">
      <button class="page-button" :disabled="currentPage === 1" @click="prevPage">
        <div class="prev-icon"></div>
      </button>
      <div class="page-info">
        第 {{ currentPage }} 页，共 {{ totalPages }} 页
      </div>
      <button class="page-button" :disabled="currentPage === totalPages" @click="nextPage">
        <div class="next-icon"></div>
      </button>
    </div>
  </div>
</template>

<script>
import { orderApi } from '@/api'

export default {
  name: 'OrderCustomerView',
  
  data() {
    return {
      searchQuery: '',
      statusFilter: '',
      currentPage: 1,
      pageSize: 10,
      total: 0,
      loading: false,
      orders: []
    }
  },

  computed: {
    totalPages() {
      return Math.ceil(this.total / this.pageSize)
    },
    
    filteredOrders() {
      return this.orders.filter(order => {
        const matchesSearch = 
          (order.order_id && order.order_id.toString().includes(this.searchQuery)) ||
          (order.Shipper && order.Shipper.shipper_name && order.Shipper.shipper_name.toLowerCase().includes(this.searchQuery.toLowerCase())) ||
          (order.Inventory && order.Inventory.Product && order.Inventory.Product.product_name && order.Inventory.Product.product_name.toLowerCase().includes(this.searchQuery.toLowerCase()))
        
        const matchesStatus = !this.statusFilter || order.status === this.statusFilter
        
        return matchesSearch && matchesStatus
      })
    }
  },

  methods: {
    async loadOrders() {
      try {
        this.loading = true
        const response = await orderApi.getList({
          page: this.currentPage,
          pageSize: this.pageSize,
          status: this.statusFilter,
          keyword: this.searchQuery
        })
        this.orders = response.list || []
        this.total = response.total || 0
      } catch (error) {
        console.error('加载订单列表失败:', error)
        alert('加载订单列表失败')
      } finally {
        this.loading = false
      }
    },

    getStatusClass(status) {
      const classes = {
        '创建': 'status-pending',
        '处理中': 'status-processing',
        '已发货': 'status-shipped',
        '已完成': 'status-completed',
        '已取消': 'status-cancelled',
        '退货中': 'status-return'
      }
      return classes[status] || ''
    },

    getStatusText(status) {
      return status || '未知状态'
    },

    async viewOrder(order) {
      try {
        const response = await orderApi.getById(order.order_id)
        console.log('订单详情:', response)
        alert(`订单详情：\n订单号：${response.order_id}\n状态：${this.getStatusText(response.status)}\n货主：${response.Shipper?.shipper_name || '未知'}`)
      } catch (error) {
        console.error('获取订单详情失败:', error)
        alert('获取订单详情失败')
      }
    },

    async processOrder(order) {
      try {
        await orderApi.updateStatus(order.order_id, { status: '处理中' })
        alert('订单已开始处理')
        this.loadOrders()
      } catch (error) {
        console.error('处理订单失败:', error)
        alert('处理订单失败')
      }
    },

    async shipOrder(order) {
      try {
        await orderApi.updateStatus(order.order_id, { status: '已发货' })
        alert('订单已发货')
        this.loadOrders()
      } catch (error) {
        console.error('发货失败:', error)
        alert('发货失败')
      }
    },

    prevPage() {
      if (this.currentPage > 1) {
        this.currentPage--
        this.loadOrders()
      }
    },

    nextPage() {
      if (this.currentPage < this.totalPages) {
        this.currentPage++
        this.loadOrders()
      }
    }
  },

  async mounted() {
    await this.loadOrders()
  },

  watch: {
    searchQuery() {
      this.currentPage = 1
      this.loadOrders()
    },
    statusFilter() {
      this.currentPage = 1
      this.loadOrders()
    }
  }
}
</script>

<style scoped>
.order-customer-page {
  padding: 20px;
}

.page-header {
  margin-bottom: 24px;
}

.header-title {
  font-size: 24px;
  font-weight: bold;
  color: #333;
  margin-bottom: 8px;
}

.header-subtitle {
  color: #666;
}

.search-box {
  background: white;
  border-radius: 8px;
  padding: 20px;
  margin-bottom: 24px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

.search-row {
  display: flex;
  gap: 16px;
  align-items: flex-end;
}

.search-group {
  flex: 1;
}

.search-label {
  font-size: 14px;
  color: #666;
  margin-bottom: 8px;
}

.search-input-wrapper {
  position: relative;
}

.search-icon {
  position: absolute;
  left: 12px;
  top: 50%;
  transform: translateY(-50%);
  width: 16px;
  height: 16px;
  border: 2px solid #666;
  border-radius: 50%;
}

.search-icon::after {
  content: '';
  position: absolute;
  width: 2px;
  height: 8px;
  background: #666;
  transform: rotate(-45deg);
  bottom: -4px;
  right: -4px;
}

.search-input {
  width: 100%;
  padding: 8px 12px 8px 36px;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.filter-group {
  min-width: 120px;
}

.filter-label {
  font-size: 14px;
  color: #666;
  margin-bottom: 8px;
}

.filter-select {
  width: 100%;
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.order-table {
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  overflow: hidden;
}

.table-header {
  display: grid;
  grid-template-columns: 1.5fr 1fr 1fr 1.5fr 1fr 1.5fr;
  background: #fafafa;
  padding: 12px;
  font-weight: bold;
  color: #333;
}

.table-row {
  display: grid;
  grid-template-columns: 1.5fr 1fr 1fr 1.5fr 1fr 1.5fr;
  padding: 12px;
  border-top: 1px solid #eee;
}

.table-cell {
  display: flex;
  align-items: center;
  color: #666;
}

.status-badge {
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
}

.status-badge.status-pending {
  background: #fff3e6;
  color: #fa8c16;
}

.status-badge.status-processing {
  background: #e6f3ff;
  color: #0070f3;
}

.status-badge.status-shipped {
  background: #e6ffe6;
  color: #00a854;
}

.status-badge.status-delivered {
  background: #f6ffed;
  color: #52c41a;
}

.status-badge.status-cancelled {
  background: #fff1f0;
  color: #f5222d;
}

.action-buttons {
  display: flex;
  gap: 8px;
}

.action-button {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 4px 8px;
  border: none;
  border-radius: 4px;
  font-size: 12px;
  cursor: pointer;
}

.action-button.view {
  background: #e6f3ff;
  color: #0070f3;
}

.action-button.process {
  background: #fff3e6;
  color: #fa8c16;
}

.action-button.ship {
  background: #e6ffe6;
  color: #00a854;
}

.view-icon {
  width: 12px;
  height: 12px;
  position: relative;
}

.view-icon::before {
  content: '';
  position: absolute;
  width: 12px;
  height: 2px;
  background: currentColor;
  top: 0;
  left: 0;
}

.view-icon::after {
  content: '';
  position: absolute;
  width: 12px;
  height: 2px;
  background: currentColor;
  top: 6px;
  left: 0;
}

.process-icon {
  width: 12px;
  height: 12px;
  position: relative;
}

.process-icon::before {
  content: '';
  position: absolute;
  width: 12px;
  height: 2px;
  background: currentColor;
  top: 0;
  left: 0;
}

.process-icon::after {
  content: '';
  position: absolute;
  width: 2px;
  height: 12px;
  background: currentColor;
  top: 0;
  left: 5px;
}

.ship-icon {
  width: 12px;
  height: 12px;
  position: relative;
}

.ship-icon::before {
  content: '';
  position: absolute;
  width: 12px;
  height: 2px;
  background: currentColor;
  top: 0;
  left: 0;
}

.ship-icon::after {
  content: '';
  position: absolute;
  width: 6px;
  height: 6px;
  border: 2px solid currentColor;
  border-radius: 50%;
  top: 3px;
  left: 3px;
}

.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 16px;
  margin-top: 24px;
}

.page-button {
  width: 32px;
  height: 32px;
  border: 1px solid #ddd;
  border-radius: 4px;
  background: white;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}

.page-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.prev-icon {
  width: 8px;
  height: 8px;
  border-left: 2px solid #666;
  border-bottom: 2px solid #666;
  transform: rotate(45deg);
}

.next-icon {
  width: 8px;
  height: 8px;
  border-right: 2px solid #666;
  border-top: 2px solid #666;
  transform: rotate(45deg);
}

.page-info {
  color: #666;
  font-size: 14px;
}
</style> 