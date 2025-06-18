// 权限管理工具类
class PermissionManager {
  constructor() {
    this.userRoles = [];
    this.loadUserRoles();
  }

  // 加载用户角色信息
  loadUserRoles() {
    const userInfo = localStorage.getItem('userInfo');
    if (userInfo) {
      const user = JSON.parse(userInfo);
      // 从用户信息中获取角色，如果没有则设为空数组
      this.userRoles = user.roles || [];
    }
  }

  // 检查是否有指定角色
  hasRole(role) {
    return this.userRoles.includes(role);
  }

  // 检查是否有任一指定角色
  hasAnyRole(...roles) {
    return roles.some(role => this.hasRole(role));
  }

  // 检查是否有所有指定角色
  hasAllRoles(...roles) {
    return roles.every(role => this.hasRole(role));
  }

  // 检查是否是系统管理员
  isSystemAdmin() {
    return this.hasRole('系统管理员');
  }

  // 检查是否是仓库管理员
  isWarehouseManager() {
    return this.hasRole('仓库管理员');
  }

  // 检查是否是销售员
  isSalesperson() {
    return this.hasRole('销售员');
  }

  // 检查是否可以管理订单（系统管理员或仓库管理员）
  canManageOrders() {
    return this.hasAnyRole('系统管理员', '仓库管理员');
  }

  // 检查是否可以管理仓库（系统管理员或仓库管理员）
  canManageWarehouses() {
    return this.hasAnyRole('系统管理员', '仓库管理员');
  }

  // 检查是否可以管理产品（系统管理员或仓库管理员）
  canManageProducts() {
    return this.hasAnyRole('系统管理员', '仓库管理员');
  }

  // 检查是否可以删除订单（只有系统管理员）
  canDeleteOrders() {
    return this.isSystemAdmin();
  }

  // 更新用户角色（登录后调用）
  updateUserRoles(roles) {
    this.userRoles = roles || [];
  }

  // 获取当前用户角色
  getUserRoles() {
    return [...this.userRoles];
  }
}

// 创建全局实例
export const permission = new PermissionManager();

// 权限指令（Vue指令）
export const permissionDirective = {
  mounted(el, binding) {
    const { value } = binding;
    if (!value) return;

    let hasPermission = false;
    
    if (typeof value === 'string') {
      hasPermission = permission.hasRole(value);
    } else if (Array.isArray(value)) {
      hasPermission = permission.hasAnyRole(...value);
    }

    if (!hasPermission) {
      el.style.display = 'none';
    }
  },
  updated(el, binding) {
    const { value } = binding;
    if (!value) return;

    let hasPermission = false;
    
    if (typeof value === 'string') {
      hasPermission = permission.hasRole(value);
    } else if (Array.isArray(value)) {
      hasPermission = permission.hasAnyRole(...value);
    }

    if (!hasPermission) {
      el.style.display = 'none';
    } else {
      el.style.display = '';
    }
  }
};

export default permission; 