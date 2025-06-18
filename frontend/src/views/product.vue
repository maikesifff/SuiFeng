<template>
  <div class="product-page">
    <div class="page-header">
      <div class="header-title">产品信息管理</div>
      <div class="header-subtitle">查看和管理仓库内所有物资的详细信息</div>
    </div>

    <div class="search-box">
      <div class="search-row">
        <div class="search-group">
          <div class="search-label">搜索产品</div>
          <div class="search-input-wrapper">
            <div class="search-icon"></div>
            <input 
              type="text" 
              v-model="searchQuery"
              class="search-input"
              placeholder="输入产品名称、规格或编码"
              @keyup.enter="handleSearch"
            >
          </div>
        </div>
        <div class="filter-group">
          <div class="filter-label">仓库</div>
          <select v-model="warehouseFilter" class="filter-select">
            <option value="">全部仓库</option>
            <option v-for="warehouse in warehouseOptions" :key="warehouse.warehouse_id" :value="warehouse.warehouse_id">
              {{ warehouse.warehouse_name }}
            </option>
          </select>
        </div>
        <div class="filter-group">
          <div class="filter-label">供应商</div>
          <select v-model="supplierFilter" class="filter-select">
            <option value="">全部供应商</option>
            <option v-for="supplier in supplierOptions" :key="supplier.supplier_id" :value="supplier.supplier_id">
              {{ supplier.supplier_name }}
            </option>
          </select>
        </div>
        <button class="filter-button" @click="handleSearch">
          <div class="filter-icon"></div>
          <span>搜索</span>
        </button>
        <button class="add-button" @click="handleAdd">
          <span>新增产品</span>
        </button>
      </div>
    </div>

    <div v-if="loading" class="loading">
      <div class="loading-spinner"></div>
      <div>加载中...</div>
    </div>

    <div v-else class="product-grid">
      <div v-for="product in products" 
           :key="product.product_id" 
           class="product-card">
        <div class="card-header">
          <div class="card-title">{{ product.product_name }}</div>
          <div class="status-badge" :class="getStatusClass(product.status)">
            {{ getStatusText(product.status) }}
          </div>
        </div>
        <div class="card-content">
          <div class="info-row">
            <div class="info-label">产品编码</div>
            <div class="info-value">{{ product.product_code }}</div>
          </div>
          <div class="info-row">
            <div class="info-label">规格</div>
            <div class="info-value">{{ product.specification || '暂无' }}</div>
          </div>
          <div class="info-row">
            <div class="info-label">单位</div>
            <div class="info-value">{{ product.unit }}</div>
          </div>
          <div class="info-row">
            <div class="info-label">价格</div>
            <div class="info-value">¥{{ parseFloat(product.price).toFixed(2) }}</div>
          </div>
          <div class="info-row">
            <div class="info-label">所属仓库</div>
            <div class="info-value">{{ product.warehouse?.warehouse_name || '未分配' }}</div>
          </div>
          <div class="info-row">
            <div class="info-label">供应商</div>
            <div class="info-value">{{ product.supplier?.supplier_name || '未分配' }}</div>
          </div>
          <div class="info-row">
            <div class="info-label">库存范围</div>
            <div class="info-value">{{ product.min_quantity }} - {{ product.max_quantity }} {{ product.unit }}</div>
          </div>
        </div>
        <div class="card-actions">
          <button class="action-button edit" @click="editProduct(product)">
            <div class="edit-icon"></div>
            <span>编辑</span>
          </button>
          <button class="action-button view" @click="viewProduct(product)">
            <div class="view-icon"></div>
            <span>详情</span>
          </button>
          <button class="action-button delete" @click="deleteProduct(product)">
            <div class="delete-icon"></div>
            <span>删除</span>
          </button>
        </div>
      </div>
    </div>

    <!-- 分页 -->
    <div v-if="!loading && total > 0" class="pagination">
      <div class="pagination-info">
        共 {{ total }} 条记录，第 {{ page }} / {{ Math.ceil(total / pageSize) }} 页
      </div>
      <div class="pagination-controls">
        <button @click="prevPage" :disabled="page <= 1">上一页</button>
        <button @click="nextPage" :disabled="page >= Math.ceil(total / pageSize)">下一页</button>
      </div>
    </div>

    <!-- 新增/编辑产品对话框 -->
    <div v-if="showDialog" class="dialog-overlay" @click="closeDialog">
      <div class="dialog" @click.stop>
        <div class="dialog-header">
          <h3>{{ isEdit ? '编辑产品' : '新增产品' }}</h3>
          <button class="close-btn" @click="closeDialog">×</button>
        </div>
        <div class="dialog-content">
          <form @submit.prevent="submitForm">
            <div class="form-row">
              <div class="form-group">
                <label>产品名称 *</label>
                <input v-model="form.product_name" type="text" required>
              </div>
              <div class="form-group">
                <label>产品编码 *</label>
                <input v-model="form.product_code" type="text" required>
              </div>
            </div>
            <div class="form-row">
              <div class="form-group">
                <label>所属仓库 *</label>
                <select v-model="form.warehouse_id" required>
                  <option value="">请选择仓库</option>
                  <option v-for="warehouse in warehouseOptions" :key="warehouse.warehouse_id" :value="warehouse.warehouse_id">
                    {{ warehouse.warehouse_name }}
                  </option>
                </select>
              </div>
              <div class="form-group">
                <label>供应商 *</label>
                <select v-model="form.supplier_id" required>
                  <option value="">请选择供应商</option>
                  <option v-for="supplier in supplierOptions" :key="supplier.supplier_id" :value="supplier.supplier_id">
                    {{ supplier.supplier_name }}
                  </option>
                </select>
              </div>
            </div>
            <div class="form-row">
              <div class="form-group">
                <label>分类 *</label>
                <input v-model="form.category" type="text" required>
              </div>
              <div class="form-group">
                <label>单位 *</label>
                <input v-model="form.unit" type="text" required>
              </div>
            </div>
            <div class="form-row">
              <div class="form-group">
                <label>价格 *</label>
                <input v-model="form.price" type="number" step="0.01" min="0" required>
              </div>
              <div class="form-group">
                <label>规格</label>
                <input v-model="form.specification" type="text">
              </div>
            </div>
            <div class="form-row">
              <div class="form-group">
                <label>最小库存</label>
                <input v-model="form.min_quantity" type="number" min="0">
              </div>
              <div class="form-group">
                <label>最大库存</label>
                <input v-model="form.max_quantity" type="number" min="0">
              </div>
            </div>
            <div class="form-actions">
              <button type="button" @click="closeDialog">取消</button>
              <button type="submit" :disabled="submitting">{{ submitting ? '保存中...' : '保存' }}</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { productApi, warehouseApi, supplierApi } from '@/api'

export default {
  name: 'ProductView',
  
  data() {
    return {
      loading: false,
      submitting: false,
      searchQuery: '',
      warehouseFilter: '',
      supplierFilter: '',
      products: [],
      warehouseOptions: [],
      supplierOptions: [],
      total: 0,
      page: 1,
      pageSize: 10,
      showDialog: false,
      isEdit: false,
      form: {
        product_id: '',
        product_name: '',
        product_code: '',
        warehouse_id: '',
        supplier_id: '',
        category: '',
        specification: '',
        unit: '',
        price: 0,
        min_quantity: 0,
        max_quantity: 0
      }
    }
  },

  async mounted() {
    await this.loadOptions()
    await this.loadProducts()
  },

  methods: {
    async loadProducts() {
      this.loading = true
      try {
        const params = {
          page: this.page,
          pageSize: this.pageSize
        }
        
        if (this.searchQuery) {
          params.keyword = this.searchQuery
        }
        if (this.warehouseFilter) {
          params.warehouse_id = this.warehouseFilter
        }
        if (this.supplierFilter) {
          params.supplier_id = this.supplierFilter
        }

        const response = await productApi.getList(params)
        this.products = response.list || []
        this.total = response.total || 0
      } catch (error) {
        console.error('加载产品列表失败:', error)
        this.$message?.error('加载产品列表失败')
      } finally {
        this.loading = false
      }
    },

    async loadOptions() {
      try {
        const [warehouseRes, supplierRes] = await Promise.all([
          warehouseApi.getList({ pageSize: 100 }),
          supplierApi.getList({ pageSize: 100 })
        ])
        
        this.warehouseOptions = warehouseRes.list || []
        this.supplierOptions = supplierRes.list || []
      } catch (error) {
        console.error('加载选项数据失败:', error)
      }
    },

    async handleSearch() {
      this.page = 1
      await this.loadProducts()
    },

    async prevPage() {
      if (this.page > 1) {
        this.page--
        await this.loadProducts()
      }
    },

    async nextPage() {
      if (this.page < Math.ceil(this.total / this.pageSize)) {
        this.page++
        await this.loadProducts()
      }
    },

    handleAdd() {
      this.isEdit = false
      this.form = {
        product_id: '',
        product_name: '',
        product_code: '',
        warehouse_id: '',
        supplier_id: '',
        category: '',
        specification: '',
        unit: '',
        price: 0,
        min_quantity: 0,
        max_quantity: 0
      }
      this.showDialog = true
    },

    editProduct(product) {
      this.isEdit = true
      this.form = {
        product_id: product.product_id,
        product_name: product.product_name,
        product_code: product.product_code,
        warehouse_id: product.warehouse_id,
        supplier_id: product.supplier_id,
        category: product.category,
        specification: product.specification || '',
        unit: product.unit,
        price: parseFloat(product.price),
        min_quantity: product.min_quantity,
        max_quantity: product.max_quantity
      }
      this.showDialog = true
    },

    async submitForm() {
      this.submitting = true
      try {
        if (this.isEdit) {
          await productApi.update(this.form.product_id, this.form)
          this.$message?.success('产品更新成功')
        } else {
          await productApi.create(this.form)
          this.$message?.success('产品创建成功')
        }
        
        this.closeDialog()
        await this.loadProducts()
      } catch (error) {
        console.error('保存产品失败:', error)
        this.$message?.error('保存产品失败')
      } finally {
        this.submitting = false
      }
    },

    async deleteProduct(product) {
      if (confirm(`确定要删除产品"${product.product_name}"吗？`)) {
        try {
          await productApi.delete(product.product_id)
          this.$message?.success('产品删除成功')
          await this.loadProducts()
        } catch (error) {
          console.error('删除产品失败:', error)
          this.$message?.error('删除产品失败')
        }
      }
    },

    viewProduct(product) {
      this.$router.push(`/product-detail/${product.product_id}`)
    },

    closeDialog() {
      this.showDialog = false
      this.submitting = false
    },

    getStatusClass(status) {
      return status === 1 ? 'active' : 'inactive'
    },

    getStatusText(status) {
      return status === 1 ? '正常' : '停用'
    }
  }
}
</script>

<style scoped>
.product-page {
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
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
  font-size: 14px;
}

.search-box {
  background: white;
  border-radius: 8px;
  padding: 20px;
  margin-bottom: 20px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

.search-row {
  display: flex;
  gap: 16px;
  align-items: end;
  flex-wrap: wrap;
}

.search-group, .filter-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.search-label, .filter-label {
  font-size: 14px;
  color: #333;
  font-weight: 500;
}

.search-input-wrapper {
  position: relative;
  width: 300px;
}

.search-input {
  width: 100%;
  padding: 8px 12px 8px 36px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
}

.search-icon {
  position: absolute;
  left: 12px;
  top: 50%;
  transform: translateY(-50%);
  width: 16px;
  height: 16px;
  background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>') no-repeat center;
  opacity: 0.5;
}

.filter-select {
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
  min-width: 150px;
}

.filter-button, .add-button {
  padding: 8px 16px;
  border: none;
  border-radius: 4px;
  font-size: 14px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
}

.filter-button {
  background: #007bff;
  color: white;
}

.add-button {
  background: #28a745;
  color: white;
}

.filter-button:hover, .add-button:hover {
  opacity: 0.9;
}

.loading {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px;
  color: #666;
}

.loading-spinner {
  width: 32px;
  height: 32px;
  border: 3px solid #f3f3f3;
  border-top: 3px solid #007bff;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 16px;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.product-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 20px;
}

.product-card {
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  overflow: hidden;
  transition: transform 0.2s, box-shadow 0.2s;
}

.product-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 16px rgba(0,0,0,0.15);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  border-bottom: 1px solid #eee;
}

.card-title {
  font-size: 16px;
  font-weight: 600;
  color: #333;
}

.status-badge {
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 500;
}

.status-badge.active {
  background: #e8f5e8;
  color: #28a745;
}

.status-badge.inactive {
  background: #ffeaea;
  color: #dc3545;
}

.card-content {
  padding: 16px;
}

.info-row {
  display: flex;
  justify-content: space-between;
  margin-bottom: 8px;
}

.info-label {
  color: #666;
  font-size: 14px;
  min-width: 80px;
}

.info-value {
  color: #333;
  font-size: 14px;
  font-weight: 500;
  text-align: right;
  flex: 1;
}

.card-actions {
  display: flex;
  gap: 8px;
  padding: 16px;
  border-top: 1px solid #eee;
}

.action-button {
  flex: 1;
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  background: white;
  font-size: 14px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
  transition: all 0.2s;
}

.action-button:hover {
  background: #f8f9fa;
}

.action-button.edit:hover {
  border-color: #007bff;
  color: #007bff;
}

.action-button.view:hover {
  border-color: #28a745;
  color: #28a745;
}

.action-button.delete:hover {
  border-color: #dc3545;
  color: #dc3545;
}

.pagination {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 20px;
  padding: 16px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

.pagination-controls button {
  padding: 8px 16px;
  border: 1px solid #ddd;
  border-radius: 4px;
  background: white;
  cursor: pointer;
  margin: 0 4px;
}

.pagination-controls button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.pagination-controls button:not(:disabled):hover {
  background: #f8f9fa;
}

/* 对话框样式 */
.dialog-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0,0,0,0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.dialog {
  background: white;
  border-radius: 8px;
  width: 90%;
  max-width: 600px;
  max-height: 90vh;
  overflow-y: auto;
}

.dialog-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 20px;
  border-bottom: 1px solid #eee;
}

.dialog-header h3 {
  margin: 0;
  font-size: 18px;
}

.close-btn {
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
  color: #666;
}

.dialog-content {
  padding: 20px;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
  margin-bottom: 16px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.form-group label {
  font-size: 14px;
  color: #333;
  font-weight: 500;
}

.form-group input,
.form-group select {
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
}

.form-actions {
  display: flex;
  gap: 12px;
  justify-content: flex-end;
  margin-top: 24px;
  padding-top: 16px;
  border-top: 1px solid #eee;
}

.form-actions button {
  padding: 10px 20px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
  cursor: pointer;
}

.form-actions button[type="submit"] {
  background: #007bff;
  color: white;
  border-color: #007bff;
}

.form-actions button[type="submit"]:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

@media (max-width: 768px) {
  .search-row {
    flex-direction: column;
    align-items: stretch;
  }
  
  .search-input-wrapper {
    width: 100%;
  }
  
  .product-grid {
    grid-template-columns: 1fr;
  }
  
  .form-row {
    grid-template-columns: 1fr;
  }
}
</style> 