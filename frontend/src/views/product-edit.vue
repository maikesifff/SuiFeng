<template>
  <div class="product-edit-page">
    <div class="page-header">
      <div class="header-title">编辑产品信息</div>
      <div class="header-subtitle">修改产品的详细信息和库存状态</div>
    </div>

    <div class="edit-form">
      <div class="form-section">
        <div class="section-title">基本信息</div>
        <div class="form-grid">
          <div class="form-group">
            <div class="form-label">产品名称</div>
            <input 
              type="text" 
              v-model="form.product_name"
              class="form-input"
              placeholder="请输入产品名称"
              required
            >
          </div>
          <div class="form-group">
            <div class="form-label">产品分类</div>
            <select v-model="form.category" class="form-select">
              <option value="laptop">笔记本电脑</option>
              <option value="desktop">台式电脑</option>
              <option value="tablet">平板电脑</option>
              <option value="phone">手机</option>
              <option value="accessory">配件</option>
            </select>
          </div>
          <div class="form-group">
            <div class="form-label">产品编号</div>
            <input 
              type="text" 
              v-model="form.product_code"
              class="form-input"
              placeholder="请输入产品编号"
              required
            >
          </div>
          <div class="form-group">
            <div class="form-label">规格说明</div>
            <input 
              type="text" 
              v-model="form.specification"
              class="form-input"
              placeholder="请输入产品规格"
            >
          </div>
          <div class="form-group">
            <div class="form-label">单位</div>
            <select v-model="form.unit" class="form-select">
              <option value="件">件</option>
              <option value="台">台</option>
              <option value="个">个</option>
              <option value="套">套</option>
              <option value="盒">盒</option>
            </select>
          </div>
          <div class="form-group">
            <div class="form-label">单价</div>
            <input 
              type="number" 
              v-model="form.price"
              class="form-input"
              placeholder="请输入单价"
              step="0.01"
              min="0.01"
              max="99999999.99"
            >
          </div>
        </div>
      </div>

      <div class="form-section">
        <div class="section-title">库存信息</div>
        <div class="form-grid">
          <div class="form-group">
            <div class="form-label">最小库存</div>
            <input 
              type="number" 
              v-model="form.min_quantity"
              class="form-input"
              placeholder="请输入最小库存量"
              min="0"
              max="999999"
            >
          </div>
          <div class="form-group">
            <div class="form-label">最大库存</div>
            <input 
              type="number" 
              v-model="form.max_quantity"
              class="form-input"
              placeholder="请输入最大库存量"
              min="0"
              max="999999"
            >
          </div>
          <div class="form-group">
            <div class="form-label">状态</div>
            <select v-model="form.status" class="form-select">
              <option value="1">正常</option>
              <option value="0">停用</option>
            </select>
          </div>
          <div class="form-group">
            <div class="form-label">所属仓库 *</div>
            <select v-model="form.warehouse_id" class="form-select" required>
              <option value="">请选择仓库</option>
              <option v-for="warehouse in warehouseOptions" 
                      :key="warehouse.warehouse_id" 
                      :value="warehouse.warehouse_id">
                {{ warehouse.warehouse_name }}
              </option>
            </select>
          </div>
        </div>
      </div>

      <div class="form-section">
        <div class="section-title">供应商信息</div>
        <div class="form-grid">
          <div class="form-group">
            <div class="form-label">供应商 *</div>
            <select v-model="form.supplier_id" class="form-select" required>
              <option value="">请选择供应商</option>
              <option v-for="supplier in supplierOptions" 
                      :key="supplier.supplier_id" 
                      :value="supplier.supplier_id">
                {{ supplier.supplier_name }}
              </option>
            </select>
          </div>
        </div>
      </div>

      <div class="form-actions">
        <button class="cancel-button" @click="goBack" :disabled="loading">取消</button>
        <button class="save-button" @click="handleSubmit" :disabled="loading">
          {{ loading ? '保存中...' : '保存' }}
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { productApi, warehouseApi, supplierApi } from '@/api'

export default {
  name: 'ProductEditView',
  
  data() {
    return {
      loading: false,
      submitting: false,
      isEdit: false,
      productId: null,
      form: {
        product_name: '',
        product_code: '',
        category: '',
        specification: '',
        unit: '',
        price: 0,
        min_quantity: 0,
        max_quantity: 9999,
        status: 1,
        warehouse_id: '',
        supplier_id: ''
      },
      warehouseOptions: [],
      supplierOptions: []
    }
  },

  async mounted() {
    this.productId = this.$route.query.id
    this.isEdit = !!this.productId
    
    await this.loadOptions()
    
    if (this.isEdit) {
      await this.loadProduct()
    }
  },

  methods: {
    async loadProduct() {
      if (!this.productId) return
      
      try {
        this.loading = true
        const response = await productApi.getById(this.productId)
        this.form = {
          product_name: response.product_name || '',
          product_code: response.product_code || '',
          category: response.category || '',
          specification: response.specification || '',
          unit: response.unit || '',
          price: response.price || 0,
          min_quantity: response.min_quantity || 0,
          max_quantity: response.max_quantity || 9999,
          status: response.status || 1,
          warehouse_id: response.warehouse_id || '',
          supplier_id: response.supplier_id || ''
        }
      } catch (error) {
        console.error('加载产品失败:', error)
        alert('加载产品失败')
        this.$router.push('/product')
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

    async handleSubmit() {
      // 表单验证
      if (!this.form.product_name || !this.form.product_code || !this.form.category || 
          !this.form.unit || !this.form.price || !this.form.warehouse_id || !this.form.supplier_id) {
        alert('请填写所有必填字段（产品名称、产品编号、分类、单位、单价、仓库、供应商）')
        return
      }

      if (this.form.price <= 0) {
        alert('单价必须大于0')
        return
      }

      if (this.form.price > 99999999.99) {
        alert('单价不能超过99999999.99')
        return
      }

      if (this.form.min_quantity < 0 || this.form.max_quantity < 0) {
        alert('库存数量不能为负数')
        return
      }

      if (this.form.min_quantity > 999999 || this.form.max_quantity > 999999) {
        alert('库存数量不能超过999999')
        return
      }

      if (this.form.min_quantity > this.form.max_quantity) {
        alert('最小库存不能大于最大库存')
        return
      }

      this.submitting = true
      try {
        if (this.isEdit) {
          await productApi.update(this.productId, this.form)
          alert('产品更新成功')
          // 编辑成功后回到产品详情页
          this.$router.push(`/product/detail?id=${this.productId}`)
        } else {
          await productApi.create(this.form)
          alert('产品创建成功')
          // 新增成功后回到产品列表
          this.$router.push('/product')
        }
      } catch (error) {
        console.error('保存产品失败:', error)
        alert('保存产品失败')
      } finally {
        this.submitting = false
      }
    },

    goBack() {
      // 检查是否有上一个页面历史记录
      if (window.history.length > 1) {
        // 使用浏览器后退功能回到上一个页面
        this.$router.go(-1)
      } else {
        // 如果没有历史记录，回到产品列表
        this.$router.push('/product')
      }
    }
  }
}
</script>

<style scoped>
.product-edit-page {
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

.edit-form {
  background: white;
  border-radius: 8px;
  padding: 24px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

.form-section {
  margin-bottom: 32px;
}

.section-title {
  font-size: 18px;
  font-weight: bold;
  color: #333;
  margin-bottom: 16px;
  padding-bottom: 8px;
  border-bottom: 1px solid #eee;
}

.form-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.form-label {
  font-size: 14px;
  color: #666;
}

.form-input,
.form-select {
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
}

.form-input:focus,
.form-select:focus {
  outline: none;
  border-color: #0070f3;
}

.image-upload {
  display: flex;
  gap: 20px;
}

.upload-box {
  width: 200px;
  height: 200px;
  border: 2px dashed #ddd;
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s;
}

.upload-box:hover {
  border-color: #0070f3;
}

.upload-icon {
  width: 40px;
  height: 40px;
  position: relative;
  margin-bottom: 12px;
}

.upload-icon::before {
  content: '';
  position: absolute;
  width: 40px;
  height: 2px;
  background: #666;
  top: 19px;
  left: 0;
}

.upload-icon::after {
  content: '';
  position: absolute;
  width: 2px;
  height: 40px;
  background: #666;
  top: 0;
  left: 19px;
}

.upload-text {
  color: #666;
  font-size: 14px;
}

.file-input {
  display: none;
}

.preview-image {
  width: 200px;
  height: 200px;
  position: relative;
}

.preview-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 8px;
}

.remove-image {
  position: absolute;
  top: -8px;
  right: -8px;
  width: 24px;
  height: 24px;
  background: white;
  border: 1px solid #ddd;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}

.remove-icon {
  width: 12px;
  height: 12px;
  position: relative;
}

.remove-icon::before,
.remove-icon::after {
  content: '';
  position: absolute;
  width: 12px;
  height: 2px;
  background: #666;
  top: 5px;
  left: 0;
}

.remove-icon::before {
  transform: rotate(45deg);
}

.remove-icon::after {
  transform: rotate(-45deg);
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 32px;
  padding-top: 24px;
  border-top: 1px solid #eee;
}

.cancel-button,
.save-button {
  padding: 8px 24px;
  border-radius: 4px;
  font-size: 14px;
  cursor: pointer;
}

.cancel-button {
  background: white;
  border: 1px solid #ddd;
  color: #666;
}

.save-button {
  background: #0070f3;
  border: none;
  color: white;
}
</style> 