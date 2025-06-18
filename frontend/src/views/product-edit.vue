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
              v-model="product.name"
              class="form-input"
              placeholder="请输入产品名称"
            >
          </div>
          <div class="form-group">
            <div class="form-label">规格型号</div>
            <input 
              type="text" 
              v-model="product.specification"
              class="form-input"
              placeholder="请输入规格型号"
            >
          </div>
          <div class="form-group">
            <div class="form-label">产品分类</div>
            <select v-model="product.category" class="form-select">
              <option value="computer">电脑配件</option>
              <option value="network">网络设备</option>
              <option value="consumables">消耗品</option>
            </select>
          </div>
          <div class="form-group">
            <div class="form-label">批次号</div>
            <input 
              type="text" 
              v-model="product.batchNumber"
              class="form-input"
              placeholder="请输入批次号"
            >
          </div>
        </div>
      </div>

      <div class="form-section">
        <div class="section-title">库存信息</div>
        <div class="form-grid">
          <div class="form-group">
            <div class="form-label">当前库存</div>
            <input 
              type="number" 
              v-model="product.quantity"
              class="form-input"
              placeholder="请输入库存数量"
            >
          </div>
          <div class="form-group">
            <div class="form-label">存放位置</div>
            <input 
              type="text" 
              v-model="product.location"
              class="form-input"
              placeholder="请输入存放位置"
            >
          </div>
          <div class="form-group">
            <div class="form-label">进货时间</div>
            <input 
              type="date" 
              v-model="product.purchaseDate"
              class="form-input"
            >
          </div>
          <div class="form-group">
            <div class="form-label">成本价</div>
            <input 
              type="number" 
              v-model="product.price"
              class="form-input"
              placeholder="请输入成本价"
            >
          </div>
        </div>
      </div>

      <div class="form-section">
        <div class="section-title">供应商信息</div>
        <div class="form-grid">
          <div class="form-group">
            <div class="form-label">供应商名称</div>
            <input 
              type="text" 
              v-model="product.supplier"
              class="form-input"
              placeholder="请输入供应商名称"
            >
          </div>
          <div class="form-group">
            <div class="form-label">联系人</div>
            <input 
              type="text" 
              v-model="product.contact"
              class="form-input"
              placeholder="请输入联系人"
            >
          </div>
          <div class="form-group">
            <div class="form-label">联系电话</div>
            <input 
              type="tel" 
              v-model="product.phone"
              class="form-input"
              placeholder="请输入联系电话"
            >
          </div>
          <div class="form-group">
            <div class="form-label">电子邮箱</div>
            <input 
              type="email" 
              v-model="product.email"
              class="form-input"
              placeholder="请输入电子邮箱"
            >
          </div>
        </div>
      </div>

      <div class="form-section">
        <div class="section-title">产品图片</div>
        <div class="image-upload">
          <div class="upload-box" @click="triggerUpload">
            <div class="upload-icon"></div>
            <div class="upload-text">点击上传产品图片</div>
            <input 
              type="file" 
              ref="fileInput"
              class="file-input"
              accept="image/*"
              @change="handleFileUpload"
            >
          </div>
          <div v-if="product.image" class="preview-image">
            <img :src="product.image" alt="产品图片预览">
            <button class="remove-image" @click="removeImage">
              <div class="remove-icon"></div>
            </button>
          </div>
        </div>
      </div>

      <div class="form-actions">
        <button class="cancel-button" @click="cancelEdit">取消</button>
        <button class="save-button" @click="saveProduct">保存</button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ProductEditView',
  
  data() {
    return {
      product: {
        id: null,
        name: '',
        specification: '',
        category: 'computer',
        batchNumber: '',
        quantity: 0,
        location: '',
        purchaseDate: '',
        price: 0,
        supplier: '',
        contact: '',
        phone: '',
        email: '',
        image: ''
      }
    }
  },

  methods: {
    triggerUpload() {
      this.$refs.fileInput.click()
    },

    handleFileUpload(event) {
      const file = event.target.files[0]
      if (file) {
        const reader = new FileReader()
        reader.onload = (e) => {
          this.product.image = e.target.result
        }
        reader.readAsDataURL(file)
      }
    },

    removeImage() {
      this.product.image = ''
      this.$refs.fileInput.value = ''
    },

    cancelEdit() {
      this.$router.push('/product')
    },

    saveProduct() {
      console.log('保存产品:', this.product)
      this.$router.push('/product')
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