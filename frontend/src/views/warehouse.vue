<template>
  <div class="warehouse-page">
    <div class="page-header">
      <div class="header-title">仓库管理</div>
      <div class="header-subtitle">查看和管理所有仓库的详细信息</div>
    </div>

    <div class="search-box">
      <div class="search-row">
        <div class="search-group">
          <div class="search-label">搜索仓库</div>
          <div class="search-input-wrapper">
            <div class="search-icon"></div>
            <input 
              type="text" 
              v-model="searchQuery"
              class="search-input"
              placeholder="输入仓库名称、地址或管理员"
            >
          </div>
        </div>
        <div class="filter-group">
          <div class="filter-label">状态</div>
          <select v-model="statusFilter" class="filter-select">
            <option value="">全部状态</option>
            <option value="1">正常</option>
            <option value="0">已关闭</option>
          </select>
        </div>
        <button class="add-button" @click="showAddModal = true">
          <div class="add-icon"></div>
          <span>新增仓库</span>
        </button>
      </div>
    </div>

    <div class="warehouse-grid">
      <div v-for="warehouse in filteredWarehouses" 
           :key="warehouse.warehouse_id" 
           class="warehouse-card">
        <div class="card-header">
          <div class="card-title">{{ warehouse.warehouse_name }}</div>
          <div class="status-badge" :class="getStatusClass(warehouse.status)">
            {{ getStatusText(warehouse.status) }}
          </div>
        </div>
        <div class="card-content">
          <div class="info-row">
            <div class="info-label">地址</div>
            <div class="info-value">{{ warehouse.location }}</div>
          </div>
          <div class="info-row">
            <div class="info-label">联系人</div>
            <div class="info-value">{{ warehouse.manager_name }}</div>
          </div>
          <div class="info-row">
            <div class="info-label">联系电话</div>
            <div class="info-value">{{ warehouse.contact_phone }}</div>
          </div>
          <div class="info-row">
            <div class="info-label">容量</div>
            <div class="info-value">{{ warehouse.capacity }}</div>
          </div>
        </div>
        <div class="card-actions">
          <button class="action-button edit" @click="editWarehouse(warehouse)">
            <div class="edit-icon"></div>
            <span>编辑</span>
          </button>
          <button class="action-button delete" @click="deleteWarehouse(warehouse)">
            <div class="delete-icon"></div>
            <span>删除</span>
          </button>
        </div>
      </div>
    </div>

    <div v-if="showAddModal" class="modal-overlay">
      <div class="modal-content">
        <div class="modal-header">
          <div class="modal-title">{{ editingWarehouse ? '编辑仓库' : '新增仓库' }}</div>
          <button class="close-button" @click="closeModal">&times;</button>
        </div>
        <form @submit.prevent="handleSubmit" class="modal-form">
          <div class="form-group">
            <div class="form-label">仓库名称</div>
            <input type="text" v-model="formData.warehouse_name" class="form-input" required>
          </div>
          <div class="form-group">
            <div class="form-label">仓库编码</div>
            <input type="text" v-model="formData.warehouse_code" class="form-input" required>
          </div>
          <div class="form-group">
            <div class="form-label">地址</div>
            <input type="text" v-model="formData.location" class="form-input" required>
          </div>
          <div class="form-group">
            <div class="form-label">管理员</div>
            <select v-model="formData.manager_id" @change="onManagerChange" class="form-select" required>
              <option value="">请选择管理员</option>
              <option v-for="manager in managers" :key="manager.employee_id" :value="manager.employee_id">
                {{ manager.name }} ({{ manager.department_name }})
              </option>
            </select>
          </div>
          <div class="form-group">
            <div class="form-label">联系人</div>
            <input type="text" v-model="formData.manager_name" class="form-input" required readonly>
          </div>
          <div class="form-group">
            <div class="form-label">联系电话</div>
            <input type="tel" v-model="formData.contact_phone" class="form-input" required>
          </div>
          <div class="form-group">
            <div class="form-label">容量</div>
            <input type="number" v-model="formData.capacity" class="form-input" required>
          </div>
          <div class="form-group">
            <div class="form-label">状态</div>
            <select v-model="formData.status" class="form-select" required>
              <option value="1">正常</option>
              <option value="0">已关闭</option>
            </select>
          </div>
          <div class="form-actions">
            <button type="button" class="cancel-button" @click="closeModal">取消</button>
            <button type="submit" class="submit-button">确定</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import { warehouseApi } from '@/api'
import { permission } from '@/utils/permission'

export default {
  name: 'WarehouseView',
  
  data() {
    return {
      loading: false,
      submitting: false,
      searchQuery: '',
      statusFilter: '',
      warehouses: [],
      managers: [],
      showAddModal: false,
      editingWarehouse: null,
      formData: {
        warehouse_name: '',
        warehouse_code: '',
        location: '',
        manager_id: '',
        manager_name: '',
        contact_phone: '',
        capacity: '',
        status: 1
      },
      formErrors: {}
    }
  },

  computed: {
    filteredWarehouses() {
      return this.warehouses.filter(warehouse => {
        const matchesSearch = !this.searchQuery || 
          warehouse.warehouse_name.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
          warehouse.location.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
          (warehouse.manager_name && warehouse.manager_name.toLowerCase().includes(this.searchQuery.toLowerCase()))
        
        const matchesStatus = !this.statusFilter || warehouse.status.toString() === this.statusFilter
        
        return matchesSearch && matchesStatus
      })
    }
  },

  async mounted() {
    // 检查权限，如果没有仓库管理权限就跳转到产品页面
    if (!permission.canManageWarehouses()) {
      alert('您没有权限访问仓库管理页面');
      this.$router.push('/product');
      return;
    }
    
    await this.loadWarehouses()
    await this.loadManagers()
  },

  methods: {
    async loadWarehouses() {
      this.loading = true
      try {
        const response = await warehouseApi.getList({ pageSize: 100 })
        this.warehouses = response.list || []
      } catch (error) {
        console.error('加载仓库列表失败:', error)
        alert('加载仓库列表失败')
      } finally {
        this.loading = false
      }
    },

    async loadManagers() {
      try {
        const response = await warehouseApi.getManagers()
        this.managers = response || []
      } catch (error) {
        console.error('加载管理员列表失败:', error)
      }
    },

    getStatusClass(status) {
      const classes = {
        1: 'active',
        0: 'closed'
      }
      return classes[status] || 'closed'
    },

    getStatusText(status) {
      const texts = {
        1: '正常',
        0: '已关闭'
      }
      return texts[status] || '未知'
    },

    editWarehouse(warehouse) {
      this.editingWarehouse = warehouse
      this.formData = { ...warehouse }
      this.showAddModal = true
    },

    async deleteWarehouse(warehouse) {
      if (!confirm(`确定要删除仓库"${warehouse.warehouse_name}"吗？`)) {
        return
      }
      
      try {
        await warehouseApi.delete(warehouse.warehouse_id)
        alert('仓库删除成功')
        await this.loadWarehouses()
      } catch (error) {
        console.error('删除仓库失败:', error)
        alert('删除仓库失败')
      }
    },

    closeModal() {
      this.showAddModal = false
      this.editingWarehouse = null
      this.formData = {
        warehouse_name: '',
        warehouse_code: '',
        location: '',
        manager_id: '',
        manager_name: '',
        contact_phone: '',
        capacity: '',
        status: 1
      }
    },

    async handleSubmit() {
      this.submitting = true
      try {
        if (this.editingWarehouse) {
          await warehouseApi.update(this.editingWarehouse.warehouse_id, this.formData)
          alert('仓库更新成功')
        } else {
          await warehouseApi.create(this.formData)
          alert('仓库创建成功')
        }
        
        this.closeModal()
        await this.loadWarehouses()
      } catch (error) {
        console.error('保存仓库失败:', error)
        alert('保存仓库失败')
      } finally {
        this.submitting = false
      }
    },

    onManagerChange() {
      const selectedManager = this.managers.find(m => m.employee_id == this.formData.manager_id)
      if (selectedManager) {
        this.formData.manager_name = selectedManager.name
        this.formData.contact_phone = selectedManager.phone || ''
      }
    }
  }
}
</script>

<style scoped>
.warehouse-page {
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

.add-button {
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

.add-icon {
  width: 16px;
  height: 16px;
  position: relative;
}

.add-icon::before,
.add-icon::after {
  content: '';
  position: absolute;
  background: white;
}

.add-icon::before {
  width: 16px;
  height: 2px;
  top: 7px;
  left: 0;
}

.add-icon::after {
  width: 2px;
  height: 16px;
  top: 0;
  left: 7px;
}

.warehouse-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
}

.warehouse-card {
  background: white;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.card-title {
  font-size: 18px;
  font-weight: bold;
  color: #333;
}

.status-badge {
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
}

.status-badge.active {
  background: #e6ffe6;
  color: #00a854;
}

.status-badge.closed {
  background: #fff1f0;
  color: #f5222d;
}

.card-content {
  margin-bottom: 16px;
}

.info-row {
  display: flex;
  margin-bottom: 8px;
}

.info-label {
  color: #666;
  width: 80px;
  flex-shrink: 0;
}

.info-value {
  color: #333;
  flex: 1;
}

.card-actions {
  display: flex;
  gap: 8px;
}

.action-button {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
  padding: 6px 12px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.action-button.edit {
  background: #e6f3ff;
  color: #0070f3;
}

.action-button.delete {
  background: #fff1f0;
  color: #f5222d;
}

.edit-icon {
  width: 14px;
  height: 14px;
  position: relative;
}

.edit-icon::before {
  content: '';
  position: absolute;
  width: 14px;
  height: 2px;
  background: currentColor;
  top: 0;
  left: 0;
}

.edit-icon::after {
  content: '';
  position: absolute;
  width: 2px;
  height: 14px;
  background: currentColor;
  top: 0;
  left: 0;
}

.delete-icon {
  width: 14px;
  height: 14px;
  position: relative;
}

.delete-icon::before,
.delete-icon::after {
  content: '';
  position: absolute;
  width: 14px;
  height: 2px;
  background: currentColor;
  top: 6px;
  left: 0;
}

.delete-icon::before {
  transform: rotate(45deg);
}

.delete-icon::after {
  transform: rotate(-45deg);
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0,0,0,0.5);
  display: flex;
  align-items: center;
  justify-content: center;
}

.modal-content {
  background: white;
  border-radius: 8px;
  width: 90%;
  max-width: 500px;
  max-height: 90vh;
  overflow-y: auto;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 20px;
  border-bottom: 1px solid #eee;
}

.modal-title {
  font-size: 20px;
  font-weight: bold;
  color: #333;
}

.close-button {
  background: none;
  border: none;
  font-size: 24px;
  color: #666;
  cursor: pointer;
}

.modal-form {
  padding: 20px;
}

.form-group {
  margin-bottom: 16px;
}

.form-label {
  display: block;
  margin-bottom: 8px;
  color: #333;
}

.form-input,
.form-select {
  width: 100%;
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 24px;
}

.cancel-button {
  padding: 8px 16px;
  background: #f5f5f5;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.submit-button {
  padding: 8px 16px;
  background: #0070f3;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}
</style> 