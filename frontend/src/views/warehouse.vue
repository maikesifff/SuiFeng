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
            <option value="normal">正常</option>
            <option value="maintenance">维护中</option>
            <option value="closed">已关闭</option>
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
           :key="warehouse.id" 
           class="warehouse-card">
        <div class="card-header">
          <div class="card-title">{{ warehouse.name }}</div>
          <div class="status-badge" :class="warehouse.status">
            {{ getStatusText(warehouse.status) }}
          </div>
        </div>
        <div class="card-content">
          <div class="info-row">
            <div class="info-label">地址</div>
            <div class="info-value">{{ warehouse.address }}</div>
          </div>
          <div class="info-row">
            <div class="info-label">管理员</div>
            <div class="info-value">{{ warehouse.manager }}</div>
          </div>
          <div class="info-row">
            <div class="info-label">联系电话</div>
            <div class="info-value">{{ warehouse.phone }}</div>
          </div>
          <div class="info-row">
            <div class="info-label">库存数量</div>
            <div class="info-value">{{ warehouse.inventoryCount }}</div>
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
            <input type="text" v-model="formData.name" class="form-input" required>
          </div>
          <div class="form-group">
            <div class="form-label">地址</div>
            <input type="text" v-model="formData.address" class="form-input" required>
          </div>
          <div class="form-group">
            <div class="form-label">管理员</div>
            <select v-model="formData.managerId" class="form-select" required>
              <option v-for="manager in managers" 
                      :key="manager.id" 
                      :value="manager.id">
                {{ manager.name }}
              </option>
            </select>
          </div>
          <div class="form-group">
            <div class="form-label">联系电话</div>
            <input type="tel" v-model="formData.phone" class="form-input" required>
          </div>
          <div class="form-group">
            <div class="form-label">状态</div>
            <select v-model="formData.status" class="form-select" required>
              <option value="normal">正常</option>
              <option value="maintenance">维护中</option>
              <option value="closed">已关闭</option>
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
export default {
  name: 'WarehouseView',
  
  data() {
    return {
      searchQuery: '',
      statusFilter: '',
      showAddModal: false,
      editingWarehouse: null,
      formData: {
        name: '',
        address: '',
        managerId: '',
        phone: '',
        status: 'normal'
      },
      warehouses: [
        {
          id: 1,
          name: '上海中心仓',
          address: '上海市浦东新区物流园区1号',
          manager: '张伟',
          phone: '021-12345678',
          status: 'normal',
          inventoryCount: 450
        },
        {
          id: 2,
          name: '北京分仓',
          address: '北京市大兴区物流基地A座',
          manager: '郑浩',
          phone: '010-87654321',
          status: 'normal',
          inventoryCount: 380
        },
        {
          id: 3,
          name: '广州冷链仓',
          address: '广州市白云区冷链物流中心3号楼',
          manager: '李娜',
          phone: '020-33445566',
          status: 'maintenance',
          inventoryCount: 220
        }
      ],
      managers: [
        { id: 1, name: '张伟' },
        { id: 2, name: '李娜' },
        { id: 3, name: '王刚' },
        { id: 4, name: '赵敏' }
      ]
    }
  },

  computed: {
    filteredWarehouses() {
      return this.warehouses.filter(warehouse => {
        const matchesSearch = 
          warehouse.name.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
          warehouse.address.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
          warehouse.manager.toLowerCase().includes(this.searchQuery.toLowerCase())
        
        const matchesStatus = !this.statusFilter || warehouse.status === this.statusFilter
        
        return matchesSearch && matchesStatus
      })
    }
  },

  methods: {
    getStatusText(status) {
      const statusMap = {
        normal: '正常',
        maintenance: '维护中',
        closed: '已关闭'
      }
      return statusMap[status] || status
    },

    editWarehouse(warehouse) {
      this.editingWarehouse = warehouse
      this.formData = { ...warehouse }
      this.showAddModal = true
    },

    deleteWarehouse(warehouse) {
      if (confirm('确定要删除该仓库吗？')) {
        console.log('删除仓库:', warehouse)
      }
    },

    closeModal() {
      this.showAddModal = false
      this.editingWarehouse = null
      this.formData = {
        name: '',
        address: '',
        managerId: '',
        phone: '',
        status: 'normal'
      }
    },

    handleSubmit() {
      if (this.editingWarehouse) {
        console.log('更新仓库:', this.formData)
      } else {
        console.log('新增仓库:', this.formData)
      }
      this.closeModal()
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

.status-badge.normal {
  background: #e6ffe6;
  color: #00a854;
}

.status-badge.maintenance {
  background: #fff3e6;
  color: #fa8c16;
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