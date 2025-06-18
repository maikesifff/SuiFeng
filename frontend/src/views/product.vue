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
              placeholder="输入产品名称、规格或批次号"
            >
          </div>
        </div>
        <div class="filter-group">
          <div class="filter-label">分类</div>
          <select v-model="categoryFilter" class="filter-select">
            <option value="">全部品类</option>
            <option value="computer">电脑配件</option>
            <option value="network">网络设备</option>
            <option value="consumables">消耗品</option>
          </select>
        </div>
        <button class="filter-button">
          <div class="filter-icon"></div>
          <span>筛选</span>
        </button>
      </div>
    </div>

    <div class="product-grid">
      <div v-for="product in filteredProducts" 
           :key="product.id" 
           class="product-card">
        <div class="card-header">
          <div class="card-title">{{ product.name }}</div>
          <div class="status-badge" :class="getStatusClass(product.quantity)">
            {{ getStatusText(product.quantity) }}
          </div>
        </div>
        <div class="product-image">
          <img :src="product.image" :alt="product.name">
        </div>
        <div class="card-content">
          <div class="info-row">
            <div class="info-label">规格</div>
            <div class="info-value">{{ product.specification }}</div>
          </div>
          <div class="info-row">
            <div class="info-label">库存数量</div>
            <div class="info-value">{{ product.quantity }} 件</div>
          </div>
          <div class="info-row">
            <div class="info-label">当前位置</div>
            <div class="info-value">{{ product.location }}</div>
          </div>
          <div class="info-row">
            <div class="info-label">进货时间</div>
            <div class="info-value">{{ product.purchaseDate }}</div>
          </div>
          <div class="info-row">
            <div class="info-label">供应商</div>
            <div class="info-value">{{ product.supplier }}</div>
          </div>
          <div class="info-row">
            <div class="info-label">成本价</div>
            <div class="info-value">¥{{ product.price.toFixed(2) }}</div>
          </div>
          <div class="info-row">
            <div class="info-label">批次号</div>
            <div class="info-value">{{ product.batchNumber }}</div>
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
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ProductView',
  
  data() {
    return {
      searchQuery: '',
      categoryFilter: '',
      products: [
        {
          id: 1,
          name: '罗技 G502 游戏鼠标',
          specification: '有线/16000DPI/11按键',
          quantity: 28,
          location: 'A区5排12号货架',
          purchaseDate: '2025-05-15',
          supplier: '罗技官方代理商',
          price: 299.00,
          batchNumber: 'LOGI-G502-202505',
          image: 'https://picsum.photos/400/300?random=1',
          category: 'computer'
        },
        {
          id: 2,
          name: '金士顿 16GB DDR4 3200',
          specification: '台式机/CL16/288Pin',
          quantity: 5,
          location: 'B区3排8号货架',
          purchaseDate: '2025-04-20',
          supplier: '金士顿华东代理',
          price: 329.00,
          batchNumber: 'KING-16G-202504',
          image: 'https://picsum.photos/400/300?random=2',
          category: 'computer'
        },
        {
          id: 3,
          name: 'TP-LINK 千兆交换机',
          specification: '8口/千兆/非网管',
          quantity: 0,
          location: 'C区1排5号货架',
          purchaseDate: '2025-03-10',
          supplier: 'TP-LINK官方旗舰店',
          price: 199.00,
          batchNumber: 'TPL-SW8-202503',
          image: 'https://picsum.photos/400/300?random=3',
          category: 'network'
        }
      ]
    }
  },

  computed: {
    filteredProducts() {
      return this.products.filter(product => {
        const matchesSearch = 
          product.name.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
          product.specification.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
          product.batchNumber.toLowerCase().includes(this.searchQuery.toLowerCase())
        
        const matchesCategory = !this.categoryFilter || product.category === this.categoryFilter
        
        return matchesSearch && matchesCategory
      })
    }
  },

  methods: {
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

    editProduct(product) {
      console.log('编辑产品:', product)
    },

    viewProduct(product) {
      console.log('查看产品详情:', product)
    }
  }
}
</script>

<style scoped>
.product-page {
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

.product-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
}

.product-card {
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
  margin-bottom: 16px;
}

.product-image img {
  width: 100%;
  height: 200px;
  object-fit: cover;
  border-radius: 4px;
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

.action-button.view {
  background: white;
  border: 1px solid #ddd;
  color: #333;
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

.view-icon {
  width: 14px;
  height: 14px;
  position: relative;
}

.view-icon::before {
  content: '';
  position: absolute;
  width: 14px;
  height: 2px;
  background: currentColor;
  top: 0;
  left: 0;
}

.view-icon::after {
  content: '';
  position: absolute;
  width: 14px;
  height: 2px;
  background: currentColor;
  top: 6px;
  left: 0;
}
</style> 