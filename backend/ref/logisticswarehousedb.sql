-- 创建数据库
CREATE DATABASE IF NOT EXISTS logisticswarehousedb;
USE logisticswarehousedb;
-- 部门表
CREATE TABLE department (
    dept_id INT AUTO_INCREMENT PRIMARY KEY,
    dept_name VARCHAR(50) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);


-- 员工表
CREATE TABLE employee (
    employee_id INT AUTO_INCREMENT PRIMARY KEY,
    `name` VARCHAR(50) NOT NULL,
    gender CHAR(1) CHECK(gender IN ('男', '女')),
    age INT CHECK(age >= 18 AND age <= 65),
    phone VARCHAR(20) NOT NULL,
    department_id INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (department_id) REFERENCES department(dept_id)
);

-- 用户表（关联员工）用于登录
CREATE TABLE `user` (
    user_id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    email VARCHAR(100) NOT NULL UNIQUE,
    `password`  VARCHAR(15) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    employee_id INT UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (employee_id) REFERENCES employee(employee_id)
);

-- 仓库表
CREATE TABLE warehouse (
    warehouse_id INT AUTO_INCREMENT PRIMARY KEY,
    warehouse_name VARCHAR(100) NOT NULL UNIQUE,
    address VARCHAR(200) NOT NULL,
    manager_id INT NOT NULL,-- 管理人id
    phone VARCHAR(20) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (manager_id) REFERENCES employee(employee_id)
);

-- 供应商表
CREATE TABLE supplier (
    supplier_id INT AUTO_INCREMENT PRIMARY KEY,
    address VARCHAR(200) NOT NULL,
    products VARCHAR(100) NOT NULL,
    manager VARCHAR(50) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- 商品表（基础信息）
CREATE TABLE product (
    product_id INT AUTO_INCREMENT PRIMARY KEY,
    product_name VARCHAR(100) NOT NULL,-- 商品编码
    supplier_id INT NOT NULL,
    category VARCHAR(50) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (supplier_id) REFERENCES supplier(supplier_id)
);

-- 库存表（详细库存信息）
CREATE TABLE inventory (
    inventory_id INT AUTO_INCREMENT PRIMARY KEY,-- 
    warehouse_id INT NOT NULL,
    location_name VARCHAR(100) NOT NULL COMMENT '库位名称（如：A-01-02）',
    location_status VARCHAR(20) CHECK(location_status IN ('空闲', '未满','已满')),
    product_id INT NOT NULL,-- 商品编码
    quantity INT NOT NULL DEFAULT 0 CHECK(quantity >= 0),
    unit_price DECIMAL(10,2) NOT NULL COMMENT '商品单价',
    entry_date DATE NOT NULL COMMENT '入库日期',
    expiry_date DATE COMMENT '过期时间（可为空）',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (warehouse_id) REFERENCES warehouse(warehouse_id),
    FOREIGN KEY (product_id) REFERENCES product(product_id),
    
    -- 同一仓库同一库位不能有相同商品
    UNIQUE KEY idx_warehouse_location_product (warehouse_id, location_name, product_id)
);

-- 货主表
CREATE TABLE shipper (
    shipper_id INT AUTO_INCREMENT PRIMARY KEY,
    `shipper_name` VARCHAR(50) NOT NULL,
    address VARCHAR(200) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- 车辆表
CREATE TABLE vehicle (
    plate_no VARCHAR(20) PRIMARY KEY,
    `type` VARCHAR(20) NOT NULL COMMENT '如：厢式货车、冷藏车',
    `status` VARCHAR(20) DEFAULT '空闲' CHECK(STATUS IN ('空闲', '运输中', '维修中')),
    location VARCHAR(100) NOT NULL COMMENT '车辆当前位置',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- 订单表
CREATE TABLE `order` (
    order_id INT AUTO_INCREMENT PRIMARY KEY,
    `status` VARCHAR(20) DEFAULT '创建' 
        CHECK(STATUS IN ('创建', '处理中', '已发货', '已完成', '已取消', '退货中')),
    employee_id INT,
    shipper_id INT NOT NULL,-- 货主id
    inventory_id INT NOT NULL COMMENT '具体出库的库存批次',
    quantity INT NOT NULL CHECK(quantity > 0),-- 数量
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (shipper_id) REFERENCES shipper(shipper_id),
    FOREIGN KEY (employee_id) REFERENCES employee(employee_id),
    FOREIGN KEY (inventory_id) REFERENCES inventory(inventory_id)-- 关联货物编号
);


-- 货物配送表
CREATE TABLE delivery (
    delivery_id INT AUTO_INCREMENT PRIMARY KEY,
    order_id INT NOT NULL UNIQUE,
    plate_no VARCHAR(20) NOT NULL,
    driver_id INT NOT NULL,
    destination VARCHAR(200) NOT NULL,-- 目的地
    depart_time DATETIME NOT NULL,-- 出发时间
    eta DATETIME NOT NULL,-- 预计到达时间
    actual_arrival DATETIME COMMENT '实际到达时间',
    STATUS VARCHAR(20) DEFAULT '待发车' 
        CHECK(STATUS IN ('待发车', '运输中', '已送达', '延迟', '取消')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (order_id) REFERENCES `order`(order_id),
    FOREIGN KEY (plate_no) REFERENCES vehicle(plate_no),
    FOREIGN KEY (driver_id) REFERENCES employee(employee_id)
);

-- 权限表
CREATE TABLE permission (
    perm_id INT AUTO_INCREMENT PRIMARY KEY,
    perm_name VARCHAR(100) NOT NULL COMMENT '权限名称',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- 角色表
CREATE TABLE role (
    role_id INT AUTO_INCREMENT PRIMARY KEY,
    role_name VARCHAR(50) NOT NULL UNIQUE COMMENT '角色名称',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- 用户角色关联表
CREATE TABLE employee_role (
    employee_id INT NOT NULL,
    role_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (employee_id, role_id),
    FOREIGN KEY (employee_id) REFERENCES employee(employee_id),
    FOREIGN KEY (role_id) REFERENCES role(role_id)
);

-- 角色权限关联表
CREATE TABLE role_permission (
    role_id INT NOT NULL,
    perm_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (role_id, perm_id),
    FOREIGN KEY (role_id) REFERENCES role(role_id),
    FOREIGN KEY (perm_id) REFERENCES permission(perm_id)
);

-- 模拟数据

-- 插入部门数据
INSERT INTO department (dept_name) VALUES
('仓储管理部'),
('运输配送部'),
('客户服务部'),
('采购管理部'),
('系统管理部');

-- 插入员工数据
INSERT INTO employee (NAME, gender, age, phone, department_id) VALUES
('张伟', '男', 35, '13800138001', 1),
('李娜', '女', 28, '13800138002', 1),
('王刚', '男', 42, '13800138003', 2),
('赵敏', '女', 31, '13800138004', 2),
('刘芳', '女', 26, '13800138005', 3),
('陈强', '男', 38, '13800138006', 4),
('杨雪', '女', 29, '13800138007', 5),
('周涛', '男', 45, '13800138008', 2),
('吴婷', '女', 33, '13800138009', 3),
('郑浩', '男', 40, '13800138010', 1);

-- 插入用户数据
INSERT INTO `user` (username, email, `password`, phone, employee_id) VALUES
('zhangwei', 'zhangwei@company.com', 'zw123456', '13800138001', 1),
('lina', 'lina@company.com', 'ln654321', '13800138002', 2),
('wanggang', 'wanggang@company.com', 'wg!@#$%^', '13800138003', 3),
('zhaomin', 'zhaomin@company.com', 'zm987654', '13800138004', 4),
('liufang', 'liufang@company.com', 'lf112233', '13800138005', 5);

-- 插入仓库数据
INSERT INTO warehouse (warehouse_name, address, manager_id, phone) VALUES
('上海中心仓', '上海市浦东新区物流园区1号', 1, '021-12345678'),
('北京分仓', '北京市大兴区物流基地A座', 10, '010-87654321'),
('广州冷链仓', '广州市白云区冷链物流中心3号楼', 2, '020-33445566');

-- 插入供应商数据
INSERT INTO supplier (address, products, manager, phone) VALUES
('浙江省杭州市余杭区科技园88号', '电子产品', '马云', '0571-88889999'),
('广东省深圳市南山区科技园', '电子元器件', '马化腾', '0755-66667777'),
('江苏省苏州市工业园区', '服装鞋帽', '张瑞敏', '0512-55556666'),
('四川省成都市高新区', '食品饮料', '刘永好', '028-22223333');

-- 插入商品数据
INSERT INTO product (product_name, supplier_id, category) VALUES
('iPhone 15 Pro', 1, '电子产品'),
('华为Mate 60', 1, '电子产品'),
('小米智能手环', 1, '电子产品'),
('联想笔记本电脑', 2, '电子产品'),
('耐克运动鞋', 3, '服装鞋帽'),
('阿迪达斯T恤', 3, '服装鞋帽'),
('茅台酒', 4, '食品饮料'),
('蒙牛纯牛奶', 4, '食品饮料'),
('三只松鼠坚果', 4, '食品饮料'),
('格力空调', 2, '家电');

-- 插入货主数据
INSERT INTO shipper (shipper_name, address, phone) VALUES
('京东商城', '北京市朝阳区京东大厦', '010-12341234'),
('天猫超市', '杭州市西湖区阿里巴巴园区', '0571-87658765'),
('苏宁易购', '南京市玄武区苏宁总部', '025-55667788'),
('唯品会', '广州市海珠区唯品会总部', '020-99887766');

-- 插入库存数据
INSERT INTO inventory (warehouse_id, location_name, location_status, product_id, quantity, unit_price, entry_date, expiry_date) VALUES
(1, 'A-01-01', '已满', 1, 100, 8999.00, '2023-10-01', NULL),
(1, 'A-01-02', '未满', 2, 150, 6999.00, '2023-10-05', NULL),
(1, 'B-02-01', '空闲', 3, 0, 299.00, '2023-10-10', NULL),
(1, 'C-03-01', '已满', 4, 200, 5999.00, '2023-10-15', NULL),
(2, 'A-01-01', '未满', 5, 80, 799.00, '2023-10-20', '2024-10-20'),
(2, 'A-01-02', '已满', 6, 120, 299.00, '2023-10-25', '2024-10-25'),
(3, 'D-01-01', '未满', 7, 50, 1499.00, '2023-11-01', '2025-11-01'),
(3, 'D-01-02', '未满', 8, 200, 59.00, '2023-11-05', '2024-05-05'),
(3, 'D-01-03', '已满', 9, 300, 89.00, '2023-11-10', '2024-06-10'),
(1, 'B-02-02', '未满', 10, 60, 3999.00, '2023-11-15', NULL);

-- 插入车辆数据
INSERT INTO vehicle (plate_no, TYPE, STATUS, location) VALUES
('沪A12345', '厢式货车', '空闲', '上海中心仓'),
('京B67890', '冷藏车', '运输中', '北京市区'),
('粤C11223', '厢式货车', '维修中', '广州维修厂'),
('沪D44556', '平板货车', '空闲', '上海中心仓'),
('京E77889', '冷藏车', '空闲', '北京分仓');

-- 插入订单数据
INSERT INTO `order` (STATUS, employee_id, shipper_id, inventory_id, quantity, create_time) VALUES
('已完成', 5, 1, 1, 10, '2023-11-01 09:30:00'),
('处理中', 5, 2, 2, 15, '2023-11-02 10:15:00'),
('已发货', 9, 1, 4, 5, '2023-11-03 11:20:00'),
('创建', 5, 3, 5, 20, '2023-11-04 14:45:00'),
('退货中', 9, 4, 7, 2, '2023-11-05 16:30:00'),
('处理中', 5, 1, 10, 3, '2023-11-06 10:00:00'),
('已发货', 9, 2, 8, 50, '2023-11-07 13:15:00');

-- 插入配送数据
INSERT INTO delivery (order_id, plate_no, driver_id, destination, depart_time, eta, actual_arrival, STATUS) VALUES
(1, '沪A12345', 3, '上海市徐汇区', '2023-11-01 14:00:00', '2023-11-01 15:30:00', '2023-11-01 15:20:00', '已送达'),
(3, '京B67890', 4, '北京市朝阳区', '2023-11-03 09:00:00', '2023-11-04 18:00:00', NULL, '运输中'),
(6, '沪D44556', 8, '上海市静安区', '2023-11-06 14:30:00', '2023-11-06 16:00:00', '2023-11-06 15:45:00', '已送达'),
(7, '粤C11223', 4, '广州市天河区', '2023-11-07 10:00:00', '2023-11-08 12:00:00', NULL, '运输中');

-- 插入权限数据
INSERT INTO permission (perm_name) VALUES
('系统管理'),
('用户管理'),
('仓库管理'),
('库存查看'),
('库存编辑'),
('订单管理'),
('配送管理'),
('报表查看'),
('数据导出'),
('系统设置');

-- 插入角色数据
INSERT INTO role (role_name) VALUES
('系统管理员'),
('仓库主管'),
('订单处理员'),
('配送管理员'),
('普通员工');

-- 插入用户角色关联数据
INSERT INTO employee_role (employee_id, role_id) VALUES
(1, 2),  -- 张伟: 仓库主管
(2, 2),  -- 李娜: 仓库主管
(3, 4),  -- 王刚: 配送管理员
(4, 4),  -- 赵敏: 配送管理员
(5, 3),  -- 刘芳: 订单处理员
(7, 1),  -- 杨雪: 系统管理员
(8, 4),  -- 周涛: 配送管理员
(9, 3),  -- 吴婷: 订单处理员
(10, 2); -- 郑浩: 仓库主管

-- 插入角色权限关联数据
INSERT INTO role_permission (role_id, perm_id) VALUES
-- 系统管理员
(1, 1), (1, 2), (1, 3), (1, 4), (1, 5), (1, 6), (1, 7), (1, 8), (1, 9), (1, 10),
-- 仓库主管
(2, 3), (2, 4), (2, 5), (2, 8),
-- 订单处理员
(3, 6), (3, 4), (3, 8),
-- 配送管理员
(4, 7), (4, 4), (4, 8),
-- 普通员工
(5, 4), (5, 8);
