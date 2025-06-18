<template>
  <div class="product-detail-page">
    <div class="page-header">
      <div class="header-title">产品详情</div>
      <div class="header-subtitle">查看产品的完整信息和库存状态</div>
    </div>

    <div class="detail-content">
      <div class="detail-section">
        <div class="section-title">基本信息</div>
        <div class="detail-grid">
          <div class="detail-group">
            <div class="detail-label">产品名称</div>
            <div class="detail-value">{{ product.product_name }}</div>
          </div>
          <div class="detail-group">
            <div class="detail-label">规格型号</div>
            <div class="detail-value">{{ product.specification || '暂无' }}</div>
          </div>
          <div class="detail-group">
            <div class="detail-label">产品分类</div>
            <div class="detail-value">{{ getCategoryName(product.category) }}</div>
          </div>
          <div class="detail-group">
            <div class="detail-label">产品编码</div>
            <div class="detail-value">{{ product.product_code }}</div>
          </div>
          <div class="detail-group">
            <div class="detail-label">单位</div>
            <div class="detail-value">{{ product.unit }}</div>
          </div>
          <div class="detail-group">
            <div class="detail-label">价格</div>
            <div class="detail-value">¥{{ parseFloat(product.price).toFixed(2) }}</div>
          </div>
        </div>
      </div>

      <div class="detail-section">
        <div class="section-title">仓库信息</div>
        <div class="detail-grid">
          <div class="detail-group">
            <div class="detail-label">所属仓库</div>
            <div class="detail-value">{{ product.warehouse?.warehouse_name || '未分配' }}</div>
          </div>
          <div class="detail-group">
            <div class="detail-label">仓库位置</div>
            <div class="detail-value">{{ product.warehouse?.location || '暂无' }}</div>
          </div>
          <div class="detail-group">
            <div class="detail-label">库存范围</div>
            <div class="detail-value">{{ product.min_quantity }} - {{ product.max_quantity }} {{ product.unit }}</div>
          </div>
          <div class="detail-group">
            <div class="detail-label">状态</div>
            <div class="detail-value">
              <div class="status-badge" :class="getStatusClass(product.status)">
                {{ getStatusText(product.status) }}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="detail-section">
        <div class="section-title">供应商信息</div>
        <div class="detail-grid">
          <div class="detail-group">
            <div class="detail-label">供应商名称</div>
            <div class="detail-value">{{ product.supplier?.supplier_name || '未分配' }}</div>
          </div>
          <div class="detail-group">
            <div class="detail-label">联系人</div>
            <div class="detail-value">{{ product.supplier?.contact_name || '暂无' }}</div>
          </div>
          <div class="detail-group">
            <div class="detail-label">联系电话</div>
            <div class="detail-value">{{ product.supplier?.contact_phone || '暂无' }}</div>
          </div>
        </div>
      </div>

      <div class="detail-actions">
        <button class="back-button" @click="goBack">返回列表</button>
        <button class="edit-button" @click="editProduct">编辑产品</button>
      </div>
    </div>
  </div>
</template>

<script>
import { productApi } from '@/api'

export default {
  name: 'ProductDetailView',
  
  data() {
    return {
      loading: false,
      product: {},
      productId: null
    }
  },

  async mounted() {
    this.productId = this.$route.query.id
    if (this.productId) {
      await this.loadProduct()
    } else {
      alert('未指定产品ID')
      this.$router.push('/product')
    }
  },

  methods: {
    async loadProduct() {
      try {
        this.loading = true
        const response = await productApi.getById(this.productId)
        this.product = response
      } catch (error) {
        console.error('加载产品详情失败:', error)
        alert('加载产品详情失败')
        this.$router.push('/product')
      } finally {
        this.loading = false
      }
    },

    getCategoryName(category) {
      const categories = {
        laptop: '笔记本电脑',
        desktop: '台式电脑',
        tablet: '平板电脑',
        phone: '手机',
        accessory: '配件'
      }
      return categories[category] || category
    },

    getStatusClass(status) {
      return status === 1 ? 'active' : 'inactive'
    },

    getStatusText(status) {
      return status === 1 ? '正常' : '停用'
    },

    editProduct() {
      this.$router.push(`/product/edit?id=${this.productId}`)
    },

    goBack() {
      this.$router.push('/product')
    }
  }
}
</script>

<style scoped>
.product-detail-page {
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

.detail-content {
  background: white;
  border-radius: 8px;
  padding: 24px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

.detail-section {
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

.detail-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
}

.detail-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.detail-label {
  font-size: 14px;
  color: #666;
}

.detail-value {
  font-size: 16px;
  color: #333;
  display: flex;
  align-items: center;
  gap: 8px;
}

.quantity-value {
  font-size: 20px;
  font-weight: bold;
}

.quantity-unit {
  color: #666;
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

.status-badge.inactive {
  background: #fff3e6;
  color: #fa8c16;
}

.product-image {
  width: 400px;
  height: 300px;
}

.product-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 8px;
}

.inventory-table {
  border: 1px solid #eee;
  border-radius: 8px;
  overflow: hidden;
}

.table-header {
  display: grid;
  grid-template-columns: 1fr 1fr 1.5fr 1fr 2fr;
  background: #fafafa;
  padding: 12px;
  font-weight: bold;
  color: #333;
}

.table-row {
  display: grid;
  grid-template-columns: 1fr 1fr 1.5fr 1fr 2fr;
  padding: 12px;
  border-top: 1px solid #eee;
}

.table-cell {
  color: #666;
}

.quantity-in {
  color: #00a854;
}

.quantity-out {
  color: #f5222d;
}

.detail-actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 24px;
}

.back-button {
  padding: 8px 16px;
  background: #f0f0f0;
  color: #333;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.back-button:hover {
  background: #e0e0e0;
}

.edit-button {
  padding: 8px 16px;
  background: #e6f3ff;
  color: #0070f3;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.edit-button:hover {
  background: #d1e9ff;
}
</style> 