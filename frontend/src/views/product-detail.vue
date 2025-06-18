<template>
  <div class="product-detail-page">
    <div class="page-header">
      <div class="header-title">产品详情</div>
      <div class="header-subtitle">查看产品的完整信息和库存状态</div>
    </div>

    <div class="detail-content">
      <div class="detail-section">
        <div class="section-header">
          <div class="section-title">基本信息</div>
          <button class="edit-button" @click="editProduct">
            <div class="edit-icon"></div>
            <span>编辑</span>
          </button>
        </div>
        <div class="detail-grid">
          <div class="detail-group">
            <div class="detail-label">产品名称</div>
            <div class="detail-value">{{ product.name }}</div>
          </div>
          <div class="detail-group">
            <div class="detail-label">规格型号</div>
            <div class="detail-value">{{ product.specification }}</div>
          </div>
          <div class="detail-group">
            <div class="detail-label">产品分类</div>
            <div class="detail-value">{{ getCategoryName(product.category) }}</div>
          </div>
          <div class="detail-group">
            <div class="detail-label">批次号</div>
            <div class="detail-value">{{ product.batchNumber }}</div>
          </div>
        </div>
      </div>

      <div class="detail-section">
        <div class="section-title">库存信息</div>
        <div class="detail-grid">
          <div class="detail-group">
            <div class="detail-label">当前库存</div>
            <div class="detail-value">
              <span class="quantity-value">{{ product.quantity }}</span>
              <span class="quantity-unit">件</span>
              <div class="status-badge" :class="getStatusClass(product.quantity)">
                {{ getStatusText(product.quantity) }}
              </div>
            </div>
          </div>
          <div class="detail-group">
            <div class="detail-label">存放位置</div>
            <div class="detail-value">{{ product.location }}</div>
          </div>
          <div class="detail-group">
            <div class="detail-label">进货时间</div>
            <div class="detail-value">{{ product.purchaseDate }}</div>
          </div>
          <div class="detail-group">
            <div class="detail-label">成本价</div>
            <div class="detail-value">¥{{ product.price.toFixed(2) }}</div>
          </div>
        </div>
      </div>

      <div class="detail-section">
        <div class="section-title">供应商信息</div>
        <div class="detail-grid">
          <div class="detail-group">
            <div class="detail-label">供应商名称</div>
            <div class="detail-value">{{ product.supplier }}</div>
          </div>
          <div class="detail-group">
            <div class="detail-label">联系人</div>
            <div class="detail-value">{{ product.contact }}</div>
          </div>
          <div class="detail-group">
            <div class="detail-label">联系电话</div>
            <div class="detail-value">{{ product.phone }}</div>
          </div>
          <div class="detail-group">
            <div class="detail-label">电子邮箱</div>
            <div class="detail-value">{{ product.email }}</div>
          </div>
        </div>
      </div>

      <div class="detail-section">
        <div class="section-title">产品图片</div>
        <div class="product-image">
          <img :src="product.image" :alt="product.name">
        </div>
      </div>

      <div class="detail-section">
        <div class="section-title">库存记录</div>
        <div class="inventory-table">
          <div class="table-header">
            <div class="header-cell">操作类型</div>
            <div class="header-cell">数量</div>
            <div class="header-cell">操作时间</div>
            <div class="header-cell">操作人</div>
            <div class="header-cell">备注</div>
          </div>
          <div v-for="record in inventoryRecords" 
               :key="record.id" 
               class="table-row">
            <div class="table-cell">{{ record.type }}</div>
            <div class="table-cell" :class="getQuantityClass(record.quantity)">
              {{ record.quantity > 0 ? '+' : '' }}{{ record.quantity }}
            </div>
            <div class="table-cell">{{ record.time }}</div>
            <div class="table-cell">{{ record.operator }}</div>
            <div class="table-cell">{{ record.remark }}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ProductDetailView',
  
  data() {
    return {
      product: {
        id: 1,
        name: '罗技 G502 游戏鼠标',
        specification: '有线/16000DPI/11按键',
        category: 'computer',
        batchNumber: 'LOGI-G502-202505',
        quantity: 28,
        location: 'A区5排12号货架',
        purchaseDate: '2025-05-15',
        price: 299.00,
        supplier: '罗技官方代理商',
        contact: '张经理',
        phone: '13800138000',
        email: 'zhang@logitech.com',
        image: 'https://picsum.photos/400/300?random=1'
      },
      inventoryRecords: [
        {
          id: 1,
          type: '入库',
          quantity: 50,
          time: '2025-05-15 10:30',
          operator: '王仓库',
          remark: '新货入库'
        },
        {
          id: 2,
          type: '出库',
          quantity: -10,
          time: '2025-05-16 14:20',
          operator: '李订单',
          remark: '订单发货'
        },
        {
          id: 3,
          type: '出库',
          quantity: -12,
          time: '2025-05-17 09:15',
          operator: '李订单',
          remark: '订单发货'
        }
      ]
    }
  },

  methods: {
    getCategoryName(category) {
      const categories = {
        computer: '电脑配件',
        network: '网络设备',
        consumables: '消耗品'
      }
      return categories[category] || category
    },

    getStatusClass(quantity) {
      if (quantity === 0) return 'out-of-stock'
      if (quantity < 10) return 'low-stock'
      return 'in-stock'
    },

    getStatusText(quantity) {
      if (quantity === 0) return '缺货'
      if (quantity < 10) return '库存预警'
      return '库存充足'
    },

    getQuantityClass(quantity) {
      return quantity > 0 ? 'quantity-in' : 'quantity-out'
    },

    editProduct() {
      this.$router.push('/product/edit')
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

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.section-title {
  font-size: 18px;
  font-weight: bold;
  color: #333;
  margin-bottom: 16px;
  padding-bottom: 8px;
  border-bottom: 1px solid #eee;
}

.edit-button {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 6px 12px;
  background: #e6f3ff;
  color: #0070f3;
  border: none;
  border-radius: 4px;
  cursor: pointer;
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

.status-badge.in-stock {
  background: #e6ffe6;
  color: #00a854;
}

.status-badge.low-stock {
  background: #fff3e6;
  color: #fa8c16;
}

.status-badge.out-of-stock {
  background: #fff1f0;
  color: #f5222d;
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
</style> 