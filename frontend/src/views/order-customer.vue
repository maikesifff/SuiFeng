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
              placeholder="输入订单号、客户名称或产品名称"
            >
          </div>
        </div>
        <div class="filter-group">
          <div class="filter-label">订单状态</div>
          <select v-model="statusFilter" class="filter-select">
            <option value="">全部状态</option>
            <option value="pending">待处理</option>
            <option value="processing">处理中</option>
            <option value="shipped">已发货</option>
            <option value="delivered">已送达</option>
            <option value="cancelled">已取消</option>
          </select>
        </div>
        <button class="filter-button">
          <div class="filter-icon"></div>
          <span>筛选</span>
        </button>
      </div>
    </div>

    <div class="order-table">
      <div class="table-header">
        <div class="header-cell">订单号</div>
        <div class="header-cell">客户名称</div>
        <div class="header-cell">订单金额</div>
        <div class="header-cell">下单时间</div>
        <div class="header-cell">订单状态</div>
        <div class="header-cell">操作</div>
      </div>
      <div v-for="order in filteredOrders" 
           :key="order.id" 
           class="table-row">
        <div class="table-cell">{{ order.orderNumber }}</div>
        <div class="table-cell">{{ order.customerName }}</div>
        <div class="table-cell">¥{{ order.amount.toFixed(2) }}</div>
        <div class="table-cell">{{ order.orderTime }}</div>
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
            <button v-if="order.status === 'pending'" 
                    class="action-button process" 
                    @click="processOrder(order)">
              <div class="process-icon"></div>
              <span>处理</span>
            </button>
            <button v-if="order.status === 'processing'" 
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
export default {
  name: 'OrderCustomerView',
  
  data() {
    return {
      searchQuery: '',
      statusFilter: '',
      currentPage: 1,
      totalPages: 5,
      orders: [
        {
          id: 1,
          orderNumber: 'ORD20250515001',
          customerName: '张三',
          amount: 299.00,
          orderTime: '2025-05-15 10:30',
          status: 'pending'
        },
        {
          id: 2,
          orderNumber: 'ORD20250515002',
          customerName: '李四',
          amount: 599.00,
          orderTime: '2025-05-15 11:20',
          status: 'processing'
        },
        {
          id: 3,
          orderNumber: 'ORD20250515003',
          customerName: '王五',
          amount: 899.00,
          orderTime: '2025-05-15 14:15',
          status: 'shipped'
        },
        {
          id: 4,
          orderNumber: 'ORD20250515004',
          customerName: '赵六',
          amount: 399.00,
          orderTime: '2025-05-15 16:45',
          status: 'delivered'
        },
        {
          id: 5,
          orderNumber: 'ORD20250515005',
          customerName: '钱七',
          amount: 199.00,
          orderTime: '2025-05-15 17:30',
          status: 'cancelled'
        }
      ]
    }
  },

  computed: {
    filteredOrders() {
      return this.orders.filter(order => {
        const matchesSearch = 
          order.orderNumber.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
          order.customerName.toLowerCase().includes(this.searchQuery.toLowerCase())
        
        const matchesStatus = !this.statusFilter || order.status === this.statusFilter
        
        return matchesSearch && matchesStatus
      })
    }
  },

  methods: {
    getStatusClass(status) {
      const classes = {
        pending: 'status-pending',
        processing: 'status-processing',
        shipped: 'status-shipped',
        delivered: 'status-delivered',
        cancelled: 'status-cancelled'
      }
      return classes[status] || ''
    },

    getStatusText(status) {
      const texts = {
        pending: '待处理',
        processing: '处理中',
        shipped: '已发货',
        delivered: '已送达',
        cancelled: '已取消'
      }
      return texts[status] || status
    },

    viewOrder(order) {
      console.log('查看订单:', order)
    },

    processOrder(order) {
      console.log('处理订单:', order)
    },

    shipOrder(order) {
      console.log('发货订单:', order)
    },

    prevPage() {
      if (this.currentPage > 1) {
        this.currentPage--
      }
    },

    nextPage() {
      if (this.currentPage < this.totalPages) {
        this.currentPage++
      }
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

.filter-button {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  background: #0070f3;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.filter-icon {
  width: 16px;
  height: 16px;
  position: relative;
}

.filter-icon::before {
  content: '';
  position: absolute;
  width: 16px;
  height: 2px;
  background: currentColor;
  top: 4px;
  left: 0;
}

.filter-icon::after {
  content: '';
  position: absolute;
  width: 16px;
  height: 2px;
  background: currentColor;
  top: 10px;
  left: 0;
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