<template>
  <div class="path-planning-page">
    <div class="page-header">
      <div class="header-title">最短路径规划</div>
      <div class="header-subtitle">通过搜索商品名称或编号，获取从大门到商品货架的最短路径</div>
    </div>

    <div class="search-box">
      <div class="search-title">商品搜索</div>
      <div class="search-content">
        <div class="search-input-group">
          <div class="search-label">商品名称或编号</div>
          <div class="search-input-wrapper">
            <div class="search-icon"></div>
            <input 
              type="text" 
              v-model="searchQuery"
              class="search-input"
              placeholder="请输入商品名称或编号"
            >
          </div>
        </div>
        <button class="search-button" @click="findPath">
          <div class="search-button-icon"></div>
          <span>查找路径</span>
        </button>
      </div>
    </div>

    <div class="content-grid">
      <div class="map-container">
        <div class="map-header">
          <div class="map-title">仓库地图</div>
          <div class="map-controls">
            <button class="map-control-button">
              <div class="zoom-in-icon"></div>
            </button>
            <button class="map-control-button">
              <div class="zoom-out-icon"></div>
            </button>
            <button class="map-control-button">
              <div class="expand-icon"></div>
            </button>
          </div>
        </div>
        <div class="map-content">
          <div class="map-background">
            <div class="shelf-grid">
              <div v-for="(row, rowIndex) in shelfRows" 
                   :key="rowIndex" 
                   class="shelf-column">
                <div v-for="(shelf, shelfIndex) in row" 
                     :key="shelfIndex" 
                     class="shelf-item">
                  {{ shelf }}
                </div>
              </div>
            </div>
            <div class="entrance">大门</div>
            <svg class="path-svg">
              <path 
                :d="pathData" 
                fill="none" 
                stroke="#0070f3" 
                stroke-width="2" 
                stroke-dasharray="5,3" 
                marker-end="url(#arrowhead)"
              />
            </svg>
            <defs>
              <marker 
                id="arrowhead" 
                markerWidth="10" 
                markerHeight="7" 
                refX="9" 
                refY="3.5" 
                orient="auto"
              >
                <polygon points="0 0, 10 3.5, 0 7" fill="#0070f3"/>
              </marker>
            </defs>
            <div class="start-marker">S</div>
            <div class="end-marker">E</div>
            <div v-for="(point, index) in pathPoints" 
                 :key="index" 
                 class="path-point"
                 :style="point.style">
            </div>
          </div>
        </div>
      </div>

      <div class="path-details">
        <div class="details-title">路径详情</div>
        <div class="product-info">
          <div class="product-header">
            <div class="product-name">{{ currentProduct.name }}</div>
            <div class="product-code">编号: {{ currentProduct.code }}</div>
          </div>
          <div class="info-row">
            <div class="info-icon location-icon"></div>
            <div class="info-text">存放位置: {{ currentProduct.location }}</div>
          </div>
          <div class="info-row">
            <div class="info-icon time-icon"></div>
            <div class="info-text">预计行走时间: {{ currentProduct.time }}</div>
          </div>
          <div class="info-row">
            <div class="info-icon distance-icon"></div>
            <div class="info-text">路径长度: {{ currentProduct.distance }}</div>
          </div>
        </div>

        <div class="navigation-steps">
          <div class="steps-title">导航步骤</div>
          <div class="steps-list">
            <div v-for="(step, index) in navigationSteps" 
                 :key="index" 
                 class="step-item">
              <div class="step-number">{{ index + 1 }}</div>
              <div class="step-content">
                <div class="step-title">{{ step.title }}</div>
                <div class="step-description">{{ step.description }}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="recent-searches">
      <div class="recent-header">
        <div class="recent-title">最近搜索</div>
        <button class="clear-history" @click="clearHistory">清空历史</button>
      </div>
      <div class="recent-grid">
        <button v-for="(item, index) in recentSearches" 
                :key="index" 
                class="recent-item"
                @click="selectRecentItem(item)">
          <div class="recent-item-content">
            <div class="recent-item-name">{{ item.name }}</div>
            <div class="recent-item-info">{{ item.code }} · {{ item.location }}</div>
          </div>
          <div class="history-icon"></div>
        </button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'PathPlanningView',
  
  data() {
    return {
      searchQuery: '',
      shelfRows: [
        ['A1', 'A2', 'A3', 'A4'],
        ['B1', 'B2', 'B3', 'B4'],
        ['C1', 'C2', 'C3', 'C4'],
        ['D1', 'D2', 'D3', 'D4'],
        ['E1', 'E2', 'E3', 'E4']
      ],
      currentProduct: {
        name: '罗技 G502 游戏鼠标',
        code: 'M001',
        location: 'A3货架',
        time: '1分钟',
        distance: '35米'
      },
      pathData: 'M50,95 L50,80 L50,65 L30,65 L30,50 L30,35 L30,20',
      pathPoints: [
        { style: { left: '47%', bottom: '20%' } },
        { style: { left: '47%', bottom: '35%' } },
        { style: { left: '47%', bottom: '50%' } },
        { style: { left: '32%', bottom: '50%' } },
        { style: { left: '32%', bottom: '35%' } },
        { style: { left: '32%', bottom: '20%' } }
      ],
      navigationSteps: [
        {
          title: '从大门进入仓库',
          description: '面向货架区域'
        },
        {
          title: '直走至第一个十字路口',
          description: '经过B1、C1、D1货架'
        },
        {
          title: '左转',
          description: '沿通道直行'
        },
        {
          title: 'A3货架位于左侧',
          description: '商品位于货架第2层，从左数第5个位置'
        }
      ],
      recentSearches: [
        {
          name: '罗技 G502 游戏鼠标',
          code: 'M001',
          location: 'A3货架'
        },
        {
          name: '三星 27英寸显示器',
          code: 'D005',
          location: 'C2货架'
        },
        {
          name: '雷蛇 黑寡妇蜘蛛键盘',
          code: 'K003',
          location: 'B4货架'
        },
        {
          name: '金士顿 16GB DDR4 3200',
          code: 'M002',
          location: 'D3货架'
        }
      ]
    }
  },

  methods: {
    findPath() {
      if (!this.searchQuery.trim()) {
        alert('请输入商品名称或编号')
        return
      }
      // 这里可以添加实际的路径规划逻辑
      alert(`正在规划从大门到"${this.searchQuery}"的最短路径...`)
    },

    selectRecentItem(item) {
      this.searchQuery = item.name
      this.findPath()
    },

    clearHistory() {
      this.recentSearches = []
    }
  }
}
</script>

<style scoped>
.path-planning-page {
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

.search-title {
  font-size: 18px;
  font-weight: 600;
  color: #333;
  margin-bottom: 16px;
}

.search-content {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 16px;
}

.search-input-group {
  display: flex;
  flex-direction: column;
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

.search-button {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 8px 16px;
  background: #0070f3;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  align-self: flex-end;
}

.search-button-icon {
  width: 16px;
  height: 16px;
  position: relative;
}

.search-button-icon::before {
  content: '';
  position: absolute;
  width: 16px;
  height: 2px;
  background: currentColor;
  top: 0;
  left: 0;
}

.search-button-icon::after {
  content: '';
  position: absolute;
  width: 8px;
  height: 8px;
  border: 2px solid currentColor;
  border-radius: 50%;
  top: 4px;
  left: 4px;
}

.content-grid {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 24px;
  margin-bottom: 24px;
}

.map-container {
  background: white;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

.map-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.map-title {
  font-size: 18px;
  font-weight: 600;
  color: #333;
}

.map-controls {
  display: flex;
  gap: 8px;
}

.map-control-button {
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

.zoom-in-icon {
  width: 12px;
  height: 12px;
  position: relative;
}

.zoom-in-icon::before,
.zoom-in-icon::after {
  content: '';
  position: absolute;
  background: #666;
}

.zoom-in-icon::before {
  width: 12px;
  height: 2px;
  top: 5px;
  left: 0;
}

.zoom-in-icon::after {
  width: 2px;
  height: 12px;
  top: 0;
  left: 5px;
}

.zoom-out-icon {
  width: 12px;
  height: 12px;
  position: relative;
}

.zoom-out-icon::before {
  content: '';
  position: absolute;
  width: 12px;
  height: 2px;
  background: #666;
  top: 5px;
  left: 0;
}

.expand-icon {
  width: 12px;
  height: 12px;
  position: relative;
}

.expand-icon::before,
.expand-icon::after {
  content: '';
  position: absolute;
  width: 12px;
  height: 2px;
  background: #666;
}

.expand-icon::before {
  top: 0;
  left: 0;
}

.expand-icon::after {
  bottom: 0;
  left: 0;
}

.map-content {
  position: relative;
  width: 100%;
  height: 420px;
  background: #f5f5f5;
  border-radius: 8px;
  overflow: hidden;
}

.map-background {
  position: absolute;
  inset: 0;
  background: rgba(224, 224, 224, 0.3);
}

.shelf-grid {
  position: absolute;
  left: 10%;
  top: 15%;
  width: 80%;
  height: 70%;
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 8px;
}

.shelf-column {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.shelf-item {
  width: 100%;
  height: 64px;
  background: white;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #666;
  font-size: 14px;
  box-shadow: 0 1px 2px rgba(0,0,0,0.1);
}

.entrance {
  position: absolute;
  left: 45%;
  bottom: 5%;
  width: 10%;
  height: 10%;
  background: #34d399;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: 500;
}

.path-svg {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
}

.start-marker {
  position: absolute;
  left: 47%;
  bottom: 8%;
  width: 24px;
  height: 24px;
  background: #34d399;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 12px;
  font-weight: bold;
  z-index: 10;
}

.end-marker {
  position: absolute;
  left: 27%;
  top: 18%;
  width: 24px;
  height: 24px;
  background: #0070f3;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 12px;
  font-weight: bold;
  z-index: 10;
}

.path-point {
  position: absolute;
  width: 16px;
  height: 16px;
  background: #0070f3;
  border-radius: 50%;
  transition: all 0.3s ease;
}

.path-point:hover {
  transform: scale(1.1);
  z-index: 10;
}

.path-details {
  background: white;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

.details-title {
  font-size: 18px;
  font-weight: 600;
  color: #333;
  margin-bottom: 16px;
}

.product-info {
  background: #f5f5f5;
  border-radius: 8px;
  padding: 16px;
  margin-bottom: 16px;
}

.product-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.product-name {
  font-weight: 500;
  color: #333;
}

.product-code {
  font-size: 12px;
  background: rgba(0, 112, 243, 0.1);
  color: #0070f3;
  padding: 2px 8px;
  border-radius: 12px;
}

.info-row {
  display: flex;
  align-items: center;
  margin-bottom: 12px;
}

.info-row:last-child {
  margin-bottom: 0;
}

.info-icon {
  width: 16px;
  height: 16px;
  margin-right: 8px;
}

.location-icon {
  position: relative;
}

.location-icon::before {
  content: '';
  position: absolute;
  width: 8px;
  height: 8px;
  border: 2px solid #0070f3;
  border-radius: 50%;
  top: 0;
  left: 0;
}

.location-icon::after {
  content: '';
  position: absolute;
  width: 2px;
  height: 6px;
  background: #0070f3;
  bottom: 0;
  left: 3px;
}

.time-icon {
  position: relative;
}

.time-icon::before {
  content: '';
  position: absolute;
  width: 12px;
  height: 12px;
  border: 2px solid #0070f3;
  border-radius: 50%;
  top: 0;
  left: 0;
}

.time-icon::after {
  content: '';
  position: absolute;
  width: 2px;
  height: 6px;
  background: #0070f3;
  bottom: 0;
  left: 5px;
}

.distance-icon {
  position: relative;
}

.distance-icon::before {
  content: '';
  position: absolute;
  width: 12px;
  height: 2px;
  background: #0070f3;
  top: 7px;
  left: 0;
}

.distance-icon::after {
  content: '';
  position: absolute;
  width: 6px;
  height: 6px;
  border: 2px solid #0070f3;
  border-radius: 50%;
  top: 5px;
  left: 3px;
}

.info-text {
  font-size: 14px;
  color: #333;
}

.navigation-steps {
  margin-top: 24px;
}

.steps-title {
  font-weight: 500;
  color: #333;
  margin-bottom: 12px;
}

.steps-list {
  max-height: 270px;
  overflow-y: auto;
  padding-right: 8px;
}

.step-item {
  display: flex;
  margin-bottom: 16px;
}

.step-item:last-child {
  margin-bottom: 0;
}

.step-number {
  width: 24px;
  height: 24px;
  background: #0070f3;
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: bold;
  margin-right: 12px;
  margin-top: 2px;
}

.step-content {
  flex: 1;
}

.step-title {
  font-weight: 500;
  color: #333;
  margin-bottom: 4px;
}

.step-description {
  font-size: 12px;
  color: #9e9e9e;
}

.recent-searches {
  background: white;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

.recent-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.recent-title {
  font-size: 18px;
  font-weight: 600;
  color: #333;
}

.clear-history {
  color: #9e9e9e;
  font-size: 14px;
  cursor: pointer;
}

.clear-history:hover {
  color: #0070f3;
}

.recent-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 12px;
}

.recent-item {
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

.recent-item:hover {
  background: #e0e0e0;
}

.recent-item-content {
  flex: 1;
}

.recent-item-name {
  font-weight: 500;
  color: #333;
  margin-bottom: 4px;
}

.recent-item-info {
  font-size: 12px;
  color: #9e9e9e;
}

.history-icon {
  width: 16px;
  height: 16px;
  position: relative;
}

.history-icon::before {
  content: '';
  position: absolute;
  width: 16px;
  height: 2px;
  background: #9e9e9e;
  top: 0;
  left: 0;
}

.history-icon::after {
  content: '';
  position: absolute;
  width: 16px;
  height: 2px;
  background: #9e9e9e;
  top: 7px;
  left: 0;
}
</style> 