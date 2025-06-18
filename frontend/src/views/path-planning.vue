<template>
  <div class="path-planning">
    <!-- 搜索区域 -->
    <div class="search-section">
      <div class="search-header">
        <h2>智能路径规划</h2>
        <p>输入商品名称或编号，系统将为您规划最优拣货路径</p>
      </div>
      
      <div class="search-form">
        <div class="search-input-group">
          <input 
            v-model="searchQuery"
            type="text" 
            placeholder="请输入商品名称或商品编号..."
            class="search-input"
            @keyup.enter="searchProducts"
            @input="onSearchInput"
          />
          <button 
            @click="searchProducts" 
            class="search-btn"
            :disabled="loading"
          >
            <span v-if="loading">搜索中...</span>
            <span v-else>🔍 搜索商品</span>
          </button>
        </div>
      </div>
      
      <!-- 搜索结果列表 -->
      <div v-if="searchResults.length > 0" class="search-results">
        <h4>搜索结果 ({{ searchResults.length }}个)</h4>
        <div class="results-list">
          <div 
            v-for="(item, index) in searchResults" 
            :key="index"
            class="result-item"
            @click="selectProduct(item)"
          >
            <div class="result-content">
              <div class="result-name">{{ item.Product?.product_name || '未知商品' }}</div>
              <div class="result-code">编号: {{ item.Product?.product_code || '未知' }}</div>
              <div class="result-location">位置: {{ item.location_name || '未知位置' }}</div>
              <div class="result-quantity">库存: {{ item.quantity || 0 }} {{ item.Product?.unit || '件' }}</div>
            </div>
            <div class="result-action">
              <span class="select-text">点击选择</span>
            </div>
          </div>
        </div>
      </div>
      
      <!-- 无搜索结果提示 -->
      <div v-if="searchQuery && searchResults.length === 0 && !loading && hasSearched" class="no-results">
        <div class="no-results-icon">🔍</div>
        <div class="no-results-text">未找到匹配的商品</div>
        <div class="no-results-tip">请检查商品名称或编号是否正确</div>
      </div>
    </div>

    <!-- 商品信息卡片 -->
    <div class="product-info-card">
      <div class="product-header">
        <div class="product-title">
          <h3>{{ currentProduct.name }}</h3>
          <span class="product-code">{{ currentProduct.code }}</span>
        </div>
        <button 
          v-if="currentProduct.location" 
          @click="resetPath" 
          class="reset-btn"
          title="重置路径规划"
        >
          🔄 重置
        </button>
      </div>
      <div class="product-details">
        <div class="detail-item">
          <span class="label">📍 位置：</span>
          <span class="value">{{ currentProduct.location }}</span>
        </div>
        <div class="detail-item">
          <span class="label">⏱️ 预计时间：</span>
          <span class="value">{{ currentProduct.time }}</span>
        </div>
        <div class="detail-item">
          <span class="label">📏 预计距离：</span>
          <span class="value">{{ currentProduct.distance }}</span>
        </div>
      </div>
    </div>

    <!-- 路径规划可视化 -->
    <div class="path-visualization">
      <div class="warehouse-map">
        <h4>仓库布局图</h4>
        
        <div class="warehouse-container">
          <!-- 入口标记 -->
          <div class="entrance-area">
            <div class="entrance-point">🚪 入口</div>
          </div>
          
          <!-- 主通道 -->
          <div class="main-corridor"></div>
          
          <!-- 货架区域 -->
          <div class="warehouse-zones">
            <!-- A区 -->
            <div class="zone zone-a">
              <div class="zone-header">A区</div>
              <div class="shelves">
                <div 
                  v-for="(shelf, index) in shelfRows[0]" 
                  :key="index"
                  class="shelf"
                  :class="{ 
                    'highlight': shelf === currentProduct.location,
                    'path-active': isOnPath(shelf)
                  }"
                >
                  {{ shelf.split('-')[2] }}
                </div>
              </div>
            </div>
            
            <!-- B区 -->
            <div class="zone zone-b">
              <div class="zone-header">B区</div>
              <div class="shelves">
                <div 
                  v-for="(shelf, index) in shelfRows[1]" 
                  :key="index"
                  class="shelf"
                  :class="{ 
                    'highlight': shelf === currentProduct.location,
                    'path-active': isOnPath(shelf)
                  }"
                >
                  {{ shelf.split('-')[2] }}
                </div>
              </div>
            </div>
            
            <!-- C区 -->
            <div class="zone zone-c">
              <div class="zone-header">C区</div>
              <div class="shelves">
                <div 
                  v-for="(shelf, index) in shelfRows[2]" 
                  :key="index"
                  class="shelf"
                  :class="{ 
                    'highlight': shelf === currentProduct.location,
                    'path-active': isOnPath(shelf)
                  }"
                >
                  {{ shelf.split('-')[2] }}
                </div>
              </div>
            </div>
            
            <!-- D区 -->
            <div class="zone zone-d">
              <div class="zone-header">D区</div>
              <div class="shelves">
                <div 
                  v-for="(shelf, index) in shelfRows[3]" 
                  :key="index"
                  class="shelf"
                  :class="{ 
                    'highlight': shelf === currentProduct.location,
                    'path-active': isOnPath(shelf)
                  }"
                >
                  {{ shelf.split('-')[2] }}
                </div>
              </div>
            </div>
            
            <!-- E区 -->
            <div class="zone zone-e">
              <div class="zone-header">E区</div>
              <div class="shelves">
                <div 
                  v-for="(shelf, index) in shelfRows[4]" 
                  :key="index"
                  class="shelf"
                  :class="{ 
                    'highlight': shelf === currentProduct.location,
                    'path-active': isOnPath(shelf)
                  }"
                >
                  {{ shelf.split('-')[2] }}
                </div>
              </div>
            </div>
          </div>
          
          <!-- 路径指示器 -->
          <div v-if="currentProduct.location" class="path-indicators">
            <div 
              v-for="(step, index) in pathSteps" 
              :key="index"
              class="path-step"
              :class="{
                'step-entrance': step.position === 'entrance',
                'step-corridor': step.position === 'corridor', 
                'step-target': step.position.startsWith('zone-')
              }"
              :style="step.style"
            >
              {{ index + 1 }}
            </div>
          </div>
        </div>
        
        <!-- 路径说明 -->
        <div v-if="currentProduct.location" class="path-legend">
          <div class="legend-item">
            <div class="legend-icon entrance-demo">🚪</div>
            <span>入口位置</span>
          </div>
          <div class="legend-item">
            <div class="legend-icon target-demo"></div>
            <span>目标货架 (红色闪烁)</span>
          </div>
          <div class="legend-item">
            <div class="legend-icon path-demo"></div>
            <span>路径区域 (蓝色高亮)</span>
          </div>
          <div class="legend-item">
            <div class="legend-icon step-demo">1</div>
            <span>路径步骤</span>
          </div>
        </div>
      </div>
    </div>

    <!-- 导航步骤 -->
    <div class="navigation-steps" v-if="navigationSteps.length > 0">
      <h4>🧭 导航步骤</h4>
      <div class="steps-list">
        <div 
          v-for="(step, index) in navigationSteps" 
          :key="index"
          class="step-item"
        >
          <div class="step-number">{{ index + 1 }}</div>
          <div class="step-content">
            <div class="step-title">{{ step.title }}</div>
            <div class="step-description">{{ step.description }}</div>
          </div>
        </div>
      </div>
    </div>

    <!-- 历史搜索记录 -->
    <div class="history-section" v-if="recentSearches.length > 0">
      <h4>📋 最近搜索</h4>
      <div class="history-list">
        <div 
          v-for="(item, index) in recentSearches.slice(0, 5)" 
          :key="index"
          class="history-item"
          @click="selectFromHistory(item)"
        >
          <div class="history-product">
            <span class="history-name">{{ item.name }}</span>
            <span class="history-code">{{ item.code }}</span>
          </div>
          <div class="history-location">{{ item.location }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { inventoryApi } from '@/api'

export default {
  name: 'PathPlanningView',
  
  data() {
    return {
      searchQuery: '',
      loading: false,
      shelfRows: [
        ['A区-01-001', 'A区-01-002', 'A区-01-003', 'A区-01-004'],
        ['B区-02-001', 'B区-02-002', 'B区-02-003', 'B区-02-004'],
        ['C区-03-001', 'C区-03-002', 'C区-03-003', 'C区-03-004'],
        ['D区-04-001', 'D区-04-002', 'D区-04-003', 'D区-04-004'],
        ['E区-05-001', 'E区-05-002', 'E区-05-003', 'E区-05-004']
      ],
      currentProduct: {
        name: '请搜索商品',
        code: '',
        location: '',
        time: '',
        distance: ''
      },
      pathData: '',
      pathPoints: [],
      pathSteps: [],
      navigationSteps: [],
      recentSearches: JSON.parse(localStorage.getItem('pathPlanningHistory') || '[]'),
      foundInventory: null,
      searchResults: [],
      hasSearched: false
    }
  },

  methods: {
    async searchProducts() {
      if (!this.searchQuery.trim()) {
        alert('请输入商品名称或编号')
        return
      }
      
      try {
        this.loading = true
        
        // 搜索库存中的商品
        const response = await inventoryApi.getList({
          keyword: this.searchQuery,
          pageSize: 10
        })
        
        if (response.list && response.list.length > 0) {
          this.searchResults = response.list
          this.hasSearched = true
          
          alert(`找到${response.list.length}个商品`)
        } else {
          alert('未找到匹配的商品，请检查商品名称或编号')
          this.resetPath()
        }
      } catch (error) {
        console.error('搜索商品失败:', error)
        alert('搜索商品失败，请稍后重试')
        this.resetPath()
      } finally {
        this.loading = false
      }
    },

    onSearchInput() {
      this.searchResults = []
      this.hasSearched = false
    },

    selectProduct(item) {
      this.foundInventory = item
      
      // 更新当前商品信息
      this.currentProduct = {
        name: item.Product?.product_name || '未知商品',
        code: item.Product?.product_code || '未知',
        location: item.location_name || '未知位置',
        time: this.calculateTime(item.location_name),
        distance: this.calculateDistance(item.location_name)
      }
      
      // 生成路径
      this.generatePath(item.location_name)
      
      // 生成导航步骤
      this.generateNavigationSteps(item.location_name)
      
      // 添加到历史记录
      this.addToHistory({
        name: this.currentProduct.name,
        code: this.currentProduct.code,
        location: this.currentProduct.location
      })
      
      // 清空搜索结果
      this.searchResults = []
      this.hasSearched = false
      
      alert(`已选择商品：${this.currentProduct.name}\n位置：${this.currentProduct.location}\n开始规划路径...`)
    },

    // 保留原有的findPath方法以支持历史记录功能
    async findPath() {
      if (!this.searchQuery.trim()) {
        alert('请输入商品名称或编号')
        return
      }
      
      try {
        this.loading = true
        
        // 搜索库存中的商品
        const response = await inventoryApi.getList({
          keyword: this.searchQuery,
          pageSize: 1
        })
        
        if (response.list && response.list.length > 0) {
          const inventory = response.list[0]
          this.selectProduct(inventory)
        } else {
          alert('未找到该商品，请检查商品名称或编号')
          this.resetPath()
        }
      } catch (error) {
        console.error('搜索商品失败:', error)
        alert('搜索商品失败，请稍后重试')
        this.resetPath()
      } finally {
        this.loading = false
      }
    },

    calculateTime(location) {
      // 根据位置计算预估时间（简单算法）
      if (!location) return '未知'
      
      const zone = location.charAt(0) // A, B, C, D, E
      const baseTime = {
        'A': 1,
        'B': 2,
        'C': 3,
        'D': 4,
        'E': 5
      }
      
      return `${baseTime[zone] || 3}分钟`
    },

    calculateDistance(location) {
      // 根据位置计算预估距离
      if (!location) return '未知'
      
      const zone = location.charAt(0)
      const baseDistance = {
        'A': 25,
        'B': 45,
        'C': 65,
        'D': 85,
        'E': 105
      }
      
      return `${baseDistance[zone] || 50}米`
    },

    isOnPath(shelf) {
      if (!this.currentProduct.location) return false
      
      const targetZone = this.currentProduct.location.charAt(0)
      const shelfZone = shelf.charAt(0)
      
      // 如果是目标货架所在的区域，则高亮整个区域的路径
      return shelfZone === targetZone
    },

    generatePath(location) {
      if (!location) {
        this.pathSteps = []
        return
      }
      
      const zone = location.charAt(0)
      
      // 根据区域生成路径步骤指示器的位置
      const stepConfigs = {
        'A': [
          { position: 'entrance', style: { left: '50%', bottom: '40px' } },
          { position: 'corridor', style: { left: '50%', top: '60%' } },
          { position: 'zone-a', style: { left: '10%', top: '50%' } }
        ],
        'B': [
          { position: 'entrance', style: { left: '50%', bottom: '40px' } },
          { position: 'corridor', style: { left: '50%', top: '60%' } },
          { position: 'zone-b', style: { left: '30%', top: '50%' } }
        ],
        'C': [
          { position: 'entrance', style: { left: '50%', bottom: '40px' } },
          { position: 'corridor', style: { left: '50%', top: '60%' } },
          { position: 'zone-c', style: { left: '50%', top: '50%' } }
        ],
        'D': [
          { position: 'entrance', style: { left: '50%', bottom: '40px' } },
          { position: 'corridor', style: { left: '50%', top: '60%' } },
          { position: 'zone-d', style: { left: '70%', top: '50%' } }
        ],
        'E': [
          { position: 'entrance', style: { left: '50%', bottom: '40px' } },
          { position: 'corridor', style: { left: '50%', top: '60%' } },
          { position: 'zone-e', style: { left: '90%', top: '50%' } }
        ]
      }
      
      this.pathSteps = stepConfigs[zone] || stepConfigs['C']
    },

    generateNavigationSteps(location) {
      if (!location) {
        this.navigationSteps = []
        return
      }
      
      const zone = location.charAt(0)
      const stepConfigs = {
        'A': [
          { title: '从大门进入仓库', description: '面向货架区域，准备前行' },
          { title: '直行至主通道', description: '沿着中央通道前进' },
          { title: '左转进入A区', description: '向左转进入A区货架区域' },
          { title: `到达${location}`, description: '商品位于货架指定位置' }
        ],
        'B': [
          { title: '从大门进入仓库', description: '面向货架区域，准备前行' },
          { title: '前进至B区入口', description: '经过A区，继续前行' },
          { title: '进入B区货架', description: '左转进入B区货架区域' },
          { title: `到达${location}`, description: '商品位于货架指定位置' }
        ],
        'C': [
          { title: '从大门进入仓库', description: '面向货架区域，准备前行' },
          { title: '直行至C区', description: '沿中央通道直行至C区' },
          { title: '进入C区货架', description: '进入C区货架区域' },
          { title: `到达${location}`, description: '商品位于货架指定位置' }
        ],
        'D': [
          { title: '从大门进入仓库', description: '面向货架区域，准备前行' },
          { title: '前进至D区入口', description: '经过前面区域，继续前行' },
          { title: '右转进入D区', description: '向右转进入D区货架区域' },
          { title: `到达${location}`, description: '商品位于货架指定位置' }
        ],
        'E': [
          { title: '从大门进入仓库', description: '面向货架区域，准备前行' },
          { title: '直行至主通道末端', description: '沿着中央通道走到底' },
          { title: '右转进入E区', description: '向右转进入E区货架区域' },
          { title: `到达${location}`, description: '商品位于货架指定位置' }
        ]
      }
      
      this.navigationSteps = stepConfigs[zone] || stepConfigs['C']
    },

    resetPath() {
      this.currentProduct = {
        name: '请搜索商品',
        code: '',
        location: '',
        time: '',
        distance: ''
      }
      this.pathData = ''
      this.pathPoints = []
      this.pathSteps = []
      this.navigationSteps = []
      this.foundInventory = null
      this.searchResults = []
      this.hasSearched = false
    },

    selectFromHistory(item) {
      this.searchQuery = item.name
      this.findPath()
    },

    addToHistory(item) {
      // 避免重复添加
      const exists = this.recentSearches.find(search => 
        search.name === item.name && search.location === item.location
      )
      
      if (!exists) {
        this.recentSearches.unshift(item)
        // 只保留最近10条记录
        if (this.recentSearches.length > 10) {
          this.recentSearches = this.recentSearches.slice(0, 10)
        }
        // 保存到localStorage
        localStorage.setItem('pathPlanningHistory', JSON.stringify(this.recentSearches))
      }
    },

    clearHistory() {
      this.recentSearches = []
      localStorage.removeItem('pathPlanningHistory')
    }
  }
}
</script>

<style scoped>
.path-planning {
  padding: 20px;
}

.search-section {
  margin-bottom: 24px;
}

.search-header {
  margin-bottom: 8px;
}

.search-header h2 {
  font-size: 24px;
  font-weight: bold;
  color: #333;
}

.search-header p {
  color: #666;
}

.search-form {
  background: white;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

.search-input-group {
  display: flex;
  gap: 16px;
}

.search-input {
  width: 100%;
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.search-btn {
  padding: 8px 16px;
  background: #0070f3;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  min-width: 120px;
  white-space: nowrap;
}

.product-info-card {
  background: white;
  border-radius: 8px;
  padding: 20px;
  margin-bottom: 24px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

.product-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.product-title {
  display: flex;
  align-items: center;
  gap: 12px;
}

.product-header h3 {
  font-weight: 500;
  color: #333;
  margin: 0;
}

.product-code {
  font-size: 12px;
  background: rgba(0, 112, 243, 0.1);
  color: #0070f3;
  padding: 2px 8px;
  border-radius: 12px;
}

.reset-btn {
  padding: 6px 12px;
  background: #f3f4f6;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  color: #374151;
  font-size: 12px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.reset-btn:hover {
  background: #e5e7eb;
  border-color: #9ca3af;
  transform: translateY(-1px);
}

.product-details {
  margin-top: 12px;
}

.detail-item {
  display: flex;
  align-items: center;
  margin-bottom: 8px;
}

.label {
  font-size: 14px;
  color: #666;
  margin-right: 8px;
}

.value {
  font-size: 14px;
  color: #333;
}

.path-visualization {
  margin-bottom: 24px;
}

.warehouse-map {
  background: white;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

.warehouse-map h4 {
  font-size: 18px;
  font-weight: 600;
  color: #333;
  margin-bottom: 16px;
}

.warehouse-container {
  position: relative;
  min-height: 400px;
  background: #f8f9fa;
  border-radius: 8px;
  padding: 20px;
}

.entrance-area {
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
}

.entrance-point {
  position: absolute;
  left: 50%;
  bottom: 10px;
  transform: translateX(-50%);
  padding: 8px 12px;
  background: #34d399;
  border-radius: 20px;
  color: white;
  font-size: 14px;
  font-weight: bold;
  z-index: 10;
  box-shadow: 0 2px 8px rgba(52, 211, 153, 0.3);
}

.main-corridor {
  display: none;
}

.warehouse-zones {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 16px;
  height: 100%;
  padding: 20px 0;
}

.zone {
  position: relative;
  background: white;
  border-radius: 8px;
  padding: 12px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  transition: all 0.3s ease;
}

.zone:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0,0,0,0.15);
}

.zone-header {
  font-size: 16px;
  font-weight: 600;
  color: #374151;
  text-align: center;
  margin-bottom: 12px;
  padding: 4px 8px;
  background: #f3f4f6;
  border-radius: 4px;
}

.zone-a .zone-header { background: #fef3c7; color: #92400e; }
.zone-b .zone-header { background: #dbeafe; color: #1e40af; }
.zone-c .zone-header { background: #d1fae5; color: #065f46; }
.zone-d .zone-header { background: #fce7f3; color: #be185d; }
.zone-e .zone-header { background: #ede9fe; color: #6b21a8; }

.shelves {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.shelf {
  width: 100%;
  height: 40px;
  background: #f9fafb;
  border: 1px solid #e5e7eb;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #6b7280;
  font-size: 12px;
  font-weight: 500;
  transition: all 0.3s ease;
  cursor: pointer;
}

.shelf:hover {
  background: #f3f4f6;
  border-color: #d1d5db;
}

.shelf.highlight {
  background: #fef2f2;
  border-color: #f87171;
  color: #dc2626;
  font-weight: 600;
  animation: pulse 2s infinite;
}

.shelf.path-active {
  background: #eff6ff;
  border-color: #3b82f6;
  color: #1d4ed8;
}

@keyframes pulse {
  0%, 100% { 
    transform: scale(1);
    box-shadow: 0 0 0 0 rgba(248, 113, 113, 0.7);
  }
  50% { 
    transform: scale(1.05);
    box-shadow: 0 0 0 10px rgba(248, 113, 113, 0);
  }
}

.path-indicators {
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 5;
}

.path-step {
  position: absolute;
  width: 24px;
  height: 24px;
  background: #3b82f6;
  border: 2px solid white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 12px;
  font-weight: bold;
  box-shadow: 0 2px 8px rgba(59, 130, 246, 0.4);
  animation: stepPulse 1.5s ease-in-out infinite;
  transform: translate(-50%, -50%);
}

.path-step.step-entrance {
  background: #34d399;
  box-shadow: 0 2px 8px rgba(52, 211, 153, 0.4);
}

.path-step.step-target {
  background: #dc2626;
  box-shadow: 0 2px 8px rgba(220, 38, 38, 0.4);
}

@keyframes stepPulse {
  0%, 100% { 
    transform: translate(-50%, -50%) scale(1);
    opacity: 1;
  }
  50% { 
    transform: translate(-50%, -50%) scale(1.1);
    opacity: 0.8;
  }
}

.path-legend {
  margin-top: 16px;
  display: flex;
  justify-content: center;
  gap: 24px;
  padding: 12px;
  background: #f8f9fa;
  border-radius: 6px;
}

.legend-item {
  display: flex;
  align-items: center;
  font-size: 14px;
  color: #374151;
}

.legend-icon {
  width: 20px;
  height: 20px;
  margin-right: 8px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: bold;
}

.legend-icon.entrance-demo {
  background: #34d399;
  color: white;
  font-size: 10px;
}

.legend-icon.target-demo {
  background: #fef2f2;
  border: 2px solid #f87171;
  color: #dc2626;
  animation: legendPulse 2s infinite;
}

@keyframes legendPulse {
  0%, 100% { 
    transform: scale(1);
    border-color: #f87171;
  }
  50% { 
    transform: scale(1.1);
    border-color: #dc2626;
  }
}

.legend-icon.path-demo {
  background: #eff6ff;
  border: 2px solid #3b82f6;
  color: #1d4ed8;
}

.legend-icon.step-demo {
  background: #3b82f6;
  border: 2px solid white;
  color: white;
  font-size: 10px;
  font-weight: bold;
  box-shadow: 0 2px 4px rgba(59, 130, 246, 0.3);
}

.navigation-steps {
  margin-top: 24px;
  background: white;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

.navigation-steps h4 {
  margin-bottom: 16px;
  color: #333;
}

.steps-list {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  align-items: flex-start;
}

.step-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  min-width: 140px;
  max-width: 180px;
  padding: 16px 12px;
  background: #f8f9fa;
  border: 1px solid #e9ecef;
  border-radius: 8px;
  transition: all 0.2s ease;
}

.step-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
  border-color: #0070f3;
}

.step-number {
  width: 32px;
  height: 32px;
  background: #0070f3;
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  font-weight: bold;
  margin-bottom: 8px;
}

.step-content {
  flex: 1;
}

.step-title {
  font-weight: 500;
  color: #333;
  margin-bottom: 4px;
  font-size: 14px;
}

.step-description {
  font-size: 12px;
  color: #9e9e9e;
  line-height: 1.4;
}

.history-section {
  background: white;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

.history-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 12px;
}

.history-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px;
  background: #f5f5f5;
  border-radius: 8px;
  cursor: pointer;
  border: none;
  width: 100%;
  text-align: left;
}

.history-item:hover {
  background: #e0e0e0;
}

.history-product {
  flex: 1;
}

.history-name {
  font-weight: 500;
  color: #333;
  margin-bottom: 4px;
}

.history-code {
  font-size: 12px;
  background: rgba(0, 112, 243, 0.1);
  color: #0070f3;
  padding: 2px 8px;
  border-radius: 12px;
}

.history-location {
  font-size: 12px;
  color: #9e9e9e;
}

.search-results {
  margin-top: 16px;
  background: white;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

.results-list {
  max-height: 270px;
  overflow-y: auto;
  padding-right: 8px;
}

.result-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px;
  background: #f5f5f5;
  border-radius: 8px;
  cursor: pointer;
  border: none;
  width: 100%;
  text-align: left;
  margin-bottom: 12px;
  transition: all 0.2s ease;
}

.result-item:last-child {
  margin-bottom: 0;
}

.result-item:hover {
  background: #e0e0e0;
  transform: translateX(2px);
}

.result-content {
  flex: 1;
}

.result-name {
  font-weight: 500;
  color: #333;
  margin-bottom: 6px;
  font-size: 16px;
}

.result-code {
  font-size: 12px;
  background: rgba(0, 112, 243, 0.1);
  color: #0070f3;
  padding: 2px 8px;
  border-radius: 12px;
  margin-right: 8px;
  display: inline-block;
}

.result-location {
  font-size: 12px;
  color: #666;
  margin-top: 4px;
}

.result-quantity {
  font-size: 12px;
  color: #666;
  margin-top: 2px;
}

.result-action {
  width: 80px;
  text-align: right;
}

.select-text {
  font-size: 12px;
  background: #0070f3;
  color: white;
  padding: 6px 12px;
  border-radius: 4px;
  transition: background 0.2s ease;
}

.result-item:hover .select-text {
  background: #0056b3;
}

.no-results {
  margin-top: 16px;
  background: white;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  text-align: center;
}

.no-results-icon {
  font-size: 48px;
  color: #9e9e9e;
  margin-bottom: 16px;
}

.no-results-text {
  font-size: 18px;
  font-weight: 500;
  color: #333;
  margin-bottom: 8px;
}

.no-results-tip {
  font-size: 12px;
  color: #9e9e9e;
}
</style> 