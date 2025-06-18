<template>
  <div class="order-admin-page">
    <div class="page-header">
      <div class="header-title">管理员订单管理</div>
      <div class="header-subtitle">查看和管理所有订单，包括客户订单和内部订单</div>
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
            <option value="已创建">已创建</option>
            <option value="处理中">处理中</option>
            <option value="已发货">已发货</option>
            <option value="已完成">已完成</option>
            <option value="已取消">已取消</option>
            <option value="退货中">退货中</option>
          </select>
        </div>
        <div class="action-group">
          <button class="export-button" @click="exportOrders">
            <span>导出订单</span>
          </button>
        </div>
      </div>
      
      <!-- 批量操作 -->
      <div v-if="selectedOrders.length > 0" class="bulk-actions">
        <div class="bulk-info">已选择 {{ selectedOrders.length }} 个订单</div>
        <button class="bulk-button process" @click="bulkProcess">批量处理</button>
        <button class="bulk-button ship" @click="bulkShip">批量发货</button>
        <button class="bulk-button cancel" @click="bulkCancel">批量取消</button>
        <button class="bulk-button clear" @click="clearSelection">清除选择</button>
      </div>
    </div>

    <div class="order-table">
      <div class="table-header">
        <div class="header-cell">
          <input type="checkbox" @change="selectAll" :checked="isAllSelected">
        </div>
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
        <div class="table-cell">
          <input type="checkbox" 
                 :value="order.order_id" 
                 v-model="selectedOrders"
                 @change="updateSelection">
        </div>
        <div class="table-cell">{{ order.order_id }}</div>
        <div class="table-cell">{{ order.Shipper?.shipper_name || '未知货主' }}</div>
        <div class="table-cell">{{ order.Inventory?.Product?.product_name || '未知产品' }}</div>
        <div class="table-cell">{{ order.quantity }}</div>
        <div class="table-cell">{{ formatDate(order.created_at) }}</div>
        <div class="table-cell">
          <div class="status-badge" :class="getStatusClass(order.status)">
            {{ getStatusText(order.status) }}
          </div>
        </div>
        <div class="table-cell">
          <div class="action-buttons">
            <button class="action-button view" @click="viewOrder(order)" title="查看详情">
              <div class="view-icon"></div>
            </button>
            <button v-if="order.status === '已创建'" 
                    class="action-button process" 
                    @click="processOrder(order)"
                    title="处理订单">
              <div class="process-icon"></div>
            </button>
            <button v-if="order.status === '处理中'" 
                    class="action-button ship" 
                    @click="shipOrder(order)"
                    title="发货">
              <div class="ship-icon"></div>
            </button>
            <button v-if="order.status === '已发货'" 
                    class="action-button complete" 
                    @click="completeOrder(order)"
                    title="完成订单">
              <div class="complete-icon"></div>
            </button>
            <button v-if="order.status === '退货中'" 
                    class="action-button complete" 
                    @click="completeOrder(order)"
                    title="完成退货">
              <div class="complete-icon"></div>
            </button>
            <button v-if="['已创建', '处理中'].includes(order.status)" 
                    class="action-button cancel" 
                    @click="cancelOrder(order)"
                    title="取消订单">
              <div class="cancel-icon"></div>
            </button>
            <button v-if="['已取消', '已完成'].includes(order.status)" 
                    class="action-button delete" 
                    @click="deleteOrder(order)"
                    title="删除订单">
              <div class="delete-icon"></div>
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
import { permission } from '@/utils/permission'

export default {
  name: 'OrderAdminView',
  
  data() {
    return {
      searchQuery: '',
      statusFilter: '',
      currentPage: 1,
      pageSize: 10,
      total: 0,
      loading: false,
      orders: [],
      selectedOrders: [],
      isAllSelected: false
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
    },

    isAllSelected() {
      return this.filteredOrders.length > 0 && this.selectedOrders.length === this.filteredOrders.length
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
        '已创建': 'status-pending',
        '处理中': 'status-processing',
        '已发货': 'status-shipped',
        '已完成': 'status-completed',
        '已取消': 'status-cancelled',
        '退货中': 'status-processing'
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
        alert(`订单详情：\n订单ID：${response.order_id}\n状态：${response.status}\n货主：${response.Shipper?.shipper_name || '未知'}\n产品：${response.Inventory?.Product?.product_name || '未知'}\n数量：${response.quantity}`)
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

    async cancelOrder(order) {
      if (!confirm('确定要取消这个订单吗？')) {
        return
      }
      
      try {
        await orderApi.cancel(order.order_id)
        alert('订单已取消')
        this.loadOrders()
      } catch (error) {
        console.error('取消订单失败:', error)
        alert('取消订单失败')
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
    },

    exportOrders() {
      try {
        const csvContent = this.generateCSV()
        this.downloadCSV(csvContent, 'orders.csv')
        alert('订单导出成功')
      } catch (error) {
        console.error('导出失败:', error)
        alert('导出失败')
      }
    },

    generateCSV() {
      const headers = ['订单ID', '货主名称', '产品名称', '数量', '下单时间', '订单状态']
      const rows = this.filteredOrders.map(order => [
        order.order_id,
        order.Shipper?.shipper_name || '未知货主',
        order.Inventory?.Product?.product_name || '未知产品',
        order.quantity,
        this.formatDate(order.created_at),
        order.status
      ])
      
      const csvContent = [headers, ...rows]
        .map(row => row.map(cell => `"${cell}"`).join(','))
        .join('\n')
      
      return csvContent
    },

    downloadCSV(content, filename) {
      const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' })
      const link = document.createElement('a')
      if (link.download !== undefined) {
        const url = URL.createObjectURL(blob)
        link.setAttribute('href', url)
        link.setAttribute('download', filename)
        link.style.visibility = 'hidden'
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
      }
    },

    async bulkProcess() {
      if (!confirm(`确定要批量处理 ${this.selectedOrders.length} 个订单吗？`)) {
        return
      }
      
      try {
        const promises = this.selectedOrders.map(orderId => 
          orderApi.updateStatus(orderId, { status: '处理中' })
        )
        await Promise.all(promises)
        alert('批量处理成功')
        this.clearSelection()
        this.loadOrders()
      } catch (error) {
        console.error('批量处理失败:', error)
        alert('批量处理失败')
      }
    },

    async bulkShip() {
      if (!confirm(`确定要批量发货 ${this.selectedOrders.length} 个订单吗？`)) {
        return
      }
      
      try {
        const promises = this.selectedOrders.map(orderId => 
          orderApi.updateStatus(orderId, { status: '已发货' })
        )
        await Promise.all(promises)
        alert('批量发货成功')
        this.clearSelection()
        this.loadOrders()
      } catch (error) {
        console.error('批量发货失败:', error)
        alert('批量发货失败')
      }
    },

    async bulkCancel() {
      if (!confirm(`确定要批量取消 ${this.selectedOrders.length} 个订单吗？`)) {
        return
      }
      
      try {
        const promises = this.selectedOrders.map(orderId => 
          orderApi.cancel(orderId)
        )
        await Promise.all(promises)
        alert('批量取消成功')
        this.clearSelection()
        this.loadOrders()
      } catch (error) {
        console.error('批量取消失败:', error)
        alert('批量取消失败')
      }
    },

    clearSelection() {
      this.selectedOrders = []
    },

    selectAll(event) {
      if (event.target.checked) {
        this.selectedOrders = this.filteredOrders.map(order => order.order_id)
      } else {
        this.selectedOrders = []
      }
    },

    updateSelection() {
      // 复选框状态更新时自动触发
    },

    formatDate(date) {
      if (!date) return '未知'
      const d = new Date(date)
      return d.toLocaleString('zh-CN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
      })
    },

    async completeOrder(order) {
      if (!confirm('确定要完成这个订单吗？')) {
        return
      }
      
      try {
        await orderApi.updateStatus(order.order_id, { status: '已完成' })
        alert('订单已完成')
        this.loadOrders()
      } catch (error) {
        console.error('完成订单失败:', error)
        alert('完成订单失败')
      }
    },

    async deleteOrder(order) {
      if (!confirm(`确定要删除订单 ${order.order_id} 吗？此操作不可恢复！`)) {
        return
      }
      
      try {
        await orderApi.delete(order.order_id)
        alert('订单删除成功')
        this.loadOrders()
      } catch (error) {
        console.error('删除订单失败:', error)
        alert('删除订单失败')
      }
    }
  },

  async mounted() {
    // 检查权限，如果没有订单管理权限就跳转到产品页面
    if (!permission.canManageOrders()) {
      alert('您没有权限访问订单管理页面');
      this.$router.push('/product');
      return;
    }
    
    await this.loadOrders();
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
.order-admin-page {
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

.action-group {
  display: flex;
  gap: 8px;
}

.export-button {
  background: #e6f3ff;
  color: #0070f3;
  padding: 4px 8px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.order-table {
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  overflow: hidden;
}

.table-header {
  display: grid;
  grid-template-columns: 60px 1fr 1fr 1fr 1fr 1.5fr 1fr 2fr;
  background: #fafafa;
  padding: 12px;
  font-weight: bold;
  color: #333;
}

.table-row {
  display: grid;
  grid-template-columns: 60px 1fr 1fr 1fr 1fr 1.5fr 1fr 2fr;
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

.status-badge.status-completed {
  background: #f6ffed;
  color: #52c41a;
}

.status-badge.status-cancelled {
  background: #fff1f0;
  color: #f5222d;
}

.action-buttons {
  display: flex;
  gap: 4px;
  flex-wrap: wrap;
}

.action-button {
  width: 28px;
  height: 28px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
}

.action-button:hover {
  transform: scale(1.1);
}

.action-button.view {
  background: #e6f3ff;
  color: #0070f3;
}

.action-button.process {
  background: #e6f3ff;
  color: #0070f3;
}

.action-button.ship {
  background: #e6ffe6;
  color: #00a854;
}

.action-button.complete {
  background: #f6ffed;
  color: #52c41a;
}

.action-button.cancel {
  background: #fff1f0;
  color: #f5222d;
}

.action-button.delete {
  background: #fff1f0;
  color: #f5222d;
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

.cancel-icon {
  width: 12px;
  height: 12px;
  position: relative;
}

.cancel-icon::before,
.cancel-icon::after {
  content: '';
  position: absolute;
  width: 12px;
  height: 2px;
  background: currentColor;
  top: 5px;
  left: 0;
}

.cancel-icon::before {
  transform: rotate(45deg);
}

.cancel-icon::after {
  transform: rotate(-45deg);
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

.bulk-actions {
  margin-top: 24px;
  padding: 12px;
  background: #fafafa;
  border-radius: 8px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.bulk-info {
  color: #666;
  font-size: 14px;
}

.bulk-button {
  background: #e6f3ff;
  color: #0070f3;
  padding: 4px 8px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.bulk-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.bulk-button.process {
  background: #fff3e6;
  color: #fa8c16;
}

.bulk-button.ship {
  background: #e6ffe6;
  color: #00a854;
}

.bulk-button.cancel {
  background: #fff1f0;
  color: #f5222d;
}

.bulk-button.clear {
  background: #fff1f0;
  color: #f5222d;
}

.filter-input {
  padding: 6px 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 12px;
}
</style> 