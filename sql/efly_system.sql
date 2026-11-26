/*
 Navicat Premium Dump SQL

 Source Server         : 本地localhost
 Source Server Type    : MySQL
 Source Server Version : 50624 (5.6.24)
 Source Host           : localhost:3306
 Source Schema         : efly_system

 Target Server Type    : MySQL
 Target Server Version : 50624 (5.6.24)
 File Encoding         : 65001

 Date: 26/11/2026 10:30:32
*/

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
-- Table structure for cms_article
-- ----------------------------
DROP TABLE IF EXISTS `cms_article`;
CREATE TABLE `cms_article`  (
  `gid` int(10) UNSIGNED NOT NULL AUTO_INCREMENT,
  `title` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL DEFAULT '',
  `create_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `update_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `content` longtext CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  `excerpt` longtext CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  `alias` varchar(200) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL DEFAULT '',
  `author` int(10) NOT NULL DEFAULT 1,
  `sortid` int(10) NOT NULL DEFAULT -1,
  `type` varchar(20) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL DEFAULT 'blog',
  `views` int(10) UNSIGNED NOT NULL DEFAULT 0,
  `comnum` int(10) UNSIGNED NOT NULL DEFAULT 0,
  `attnum` int(10) UNSIGNED NOT NULL DEFAULT 0,
  `top` enum('n','y') CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL DEFAULT 'n',
  `sortop` enum('n','y') CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL DEFAULT 'n',
  `hide` enum('n','y') CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL DEFAULT 'n',
  `checked` enum('n','y') CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL DEFAULT 'y',
  `allow_remark` enum('n','y') CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL DEFAULT 'y',
  PRIMARY KEY (`gid`) USING BTREE,
  INDEX `author`(`author`) USING BTREE,
  INDEX `sortid`(`sortid`) USING BTREE,
  INDEX `type`(`type`) USING BTREE,
  INDEX `views`(`views`) USING BTREE,
  INDEX `comnum`(`comnum`) USING BTREE,
  INDEX `hide`(`hide`) USING BTREE,
  INDEX `create_time`(`create_time`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 2 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci ROW_FORMAT = Compact;

-- ----------------------------
-- Records of cms_article
-- ----------------------------
INSERT INTO `cms_article` VALUES (1, 'test新文章002', '2022-09-15 14:59:18', '2026-11-24 15:17:10', '<p>5555555</p><h3>6666</h3><p>777</p><p>88888888888888888</p>', 'xxx', 'yyyyyyyyyy', 1, 6, 'blog', 0, 0, 0, 'y', 'y', 'n', 'y', 'y');

-- ----------------------------
-- Table structure for cms_article_tag
-- ----------------------------
DROP TABLE IF EXISTS `cms_article_tag`;
CREATE TABLE `cms_article_tag`  (
  `gid` bigint(20) NOT NULL COMMENT '文章ID',
  `tid` bigint(20) NOT NULL COMMENT '标签ID',
  PRIMARY KEY (`gid`, `tid`) USING BTREE
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci COMMENT = '角色和菜单关联表' ROW_FORMAT = Compact;

-- ----------------------------
-- Records of cms_article_tag
-- ----------------------------
INSERT INTO `cms_article_tag` VALUES (1, 9);
INSERT INTO `cms_article_tag` VALUES (1, 10);
INSERT INTO `cms_article_tag` VALUES (1, 11);

-- ----------------------------
-- Table structure for cms_category
-- ----------------------------
DROP TABLE IF EXISTS `cms_category`;
CREATE TABLE `cms_category`  (
  `sid` int(10) UNSIGNED NOT NULL AUTO_INCREMENT,
  `sortname` varchar(60) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL DEFAULT '',
  `alias` varchar(200) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL DEFAULT '',
  `taxis` int(10) UNSIGNED NOT NULL DEFAULT 0,
  `pid` int(10) UNSIGNED NOT NULL DEFAULT 0,
  `description` varchar(140) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  PRIMARY KEY (`sid`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 7 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci ROW_FORMAT = Compact;

-- ----------------------------
-- Records of cms_category
-- ----------------------------
INSERT INTO `cms_category` VALUES (1, '1234', 'bieming', 0, 0, '测试修改');
INSERT INTO `cms_category` VALUES (3, '测排序用001', '', 1, 0, '');
INSERT INTO `cms_category` VALUES (4, '测排序用002', '', 2, 0, '');
INSERT INTO `cms_category` VALUES (6, '我是子分类ha', '', 0, 4, '');

-- ----------------------------
-- Table structure for cms_comment
-- ----------------------------
DROP TABLE IF EXISTS `cms_comment`;
CREATE TABLE `cms_comment`  (
  `cid` int(10) UNSIGNED NOT NULL AUTO_INCREMENT,
  `gid` int(10) UNSIGNED NOT NULL DEFAULT 0,
  `pid` int(10) UNSIGNED NOT NULL DEFAULT 0,
  `date` bigint(20) NOT NULL,
  `poster` varchar(20) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL DEFAULT '',
  `comment` text CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  `mail` varchar(60) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL DEFAULT '',
  `url` varchar(75) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL DEFAULT '',
  `ip` varchar(128) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL DEFAULT '',
  `hide` enum('n','y') CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL DEFAULT 'n',
  PRIMARY KEY (`cid`) USING BTREE,
  INDEX `gid`(`gid`) USING BTREE,
  INDEX `date`(`date`) USING BTREE,
  INDEX `hide`(`hide`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 1 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci ROW_FORMAT = Compact;

-- ----------------------------
-- Records of cms_comment
-- ----------------------------

-- ----------------------------
-- Table structure for cms_link
-- ----------------------------
DROP TABLE IF EXISTS `cms_link`;
CREATE TABLE `cms_link`  (
  `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT,
  `catid` int(10) UNSIGNED NOT NULL,
  `sitename` varchar(60) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL DEFAULT '',
  `siteurl` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL DEFAULT '',
  `description` varchar(140) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL DEFAULT '',
  `hide` enum('n','y') CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL DEFAULT 'n',
  `taxis` int(10) UNSIGNED NOT NULL DEFAULT 0,
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `sortid`(`catid`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 7 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci ROW_FORMAT = Compact;

-- ----------------------------
-- Records of cms_link
-- ----------------------------
INSERT INTO `cms_link` VALUES (2, 2, 'test001', '实打实大苏打', '666666666666666', 'y', 0);
INSERT INTO `cms_link` VALUES (3, 2, '还是分类', 'http://localhost:9997/#/cms/link/list', '', 'y', 0);
INSERT INTO `cms_link` VALUES (4, 2, 'test啊哈哈', 'http://localhost:9998/#/cms/link/list', '', 'n', 0);
INSERT INTO `cms_link` VALUES (5, 1, '测分页hooks', 'https://juejin.cn/post/7165467345648320520', '', 'y', 0);
INSERT INTO `cms_link` VALUES (6, 2, 'test1116哈', 'https://juejin.cn/post/7166068828202336263', '', 'y', 0);

-- ----------------------------
-- Table structure for cms_link_category
-- ----------------------------
DROP TABLE IF EXISTS `cms_link_category`;
CREATE TABLE `cms_link_category`  (
  `catid` int(10) UNSIGNED NOT NULL AUTO_INCREMENT,
  `catname` varchar(60) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  `taxis` int(10) UNSIGNED NOT NULL DEFAULT 0,
  `description` varchar(140) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  PRIMARY KEY (`catid`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 3 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci ROW_FORMAT = Compact;

-- ----------------------------
-- Records of cms_link_category
-- ----------------------------
INSERT INTO `cms_link_category` VALUES (1, '我是分类', 0, '12345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890');
INSERT INTO `cms_link_category` VALUES (2, '撒啊三个', 0, 'd顶顶顶顶顶顶顶顶顶顶顶顶顶');

-- ----------------------------
-- Table structure for cms_tag
-- ----------------------------
DROP TABLE IF EXISTS `cms_tag`;
CREATE TABLE `cms_tag`  (
  `tid` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT,
  `tagname` varchar(60) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL DEFAULT '',
  PRIMARY KEY (`tid`) USING BTREE,
  INDEX `tagname`(`tagname`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 13 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci ROW_FORMAT = Compact;

-- ----------------------------
-- Records of cms_tag
-- ----------------------------
INSERT INTO `cms_tag` VALUES (1, '12');
INSERT INTO `cms_tag` VALUES (3, '123456');
INSERT INTO `cms_tag` VALUES (11, 'tag哈哈');
INSERT INTO `cms_tag` VALUES (6, '人才');
INSERT INTO `cms_tag` VALUES (12, '人才123');
INSERT INTO `cms_tag` VALUES (5, '哇咔咔');
INSERT INTO `cms_tag` VALUES (7, '张三');
INSERT INTO `cms_tag` VALUES (9, '标签儿');
INSERT INTO `cms_tag` VALUES (10, '签儿');

-- ----------------------------
-- Table structure for ft_person
-- ----------------------------
DROP TABLE IF EXISTS `ft_person`;
CREATE TABLE `ft_person`  (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `name` varchar(30) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  `sex` tinyint(1) NOT NULL COMMENT '性别（0女 1男）',
  `short_desc` varchar(140) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  `avatar` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  `tree_id` bigint(20) NOT NULL,
  `zibei` varchar(30) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  `rank` smallint(6) NULL DEFAULT NULL,
  `born` varchar(45) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  `death` varchar(45) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  `life_desc` text CHARACTER SET utf8 COLLATE utf8_general_ci NULL,
  `create_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `update_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 12 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci COMMENT = '家谱成员' ROW_FORMAT = Compact;

-- ----------------------------
-- Records of ft_person
-- ----------------------------
INSERT INTO `ft_person` VALUES (1, '张全蛋', 1, NULL, NULL, 4, NULL, 999, NULL, NULL, NULL, '2025-07-31 16:07:03', '2025-07-31 16:09:19');
INSERT INTO `ft_person` VALUES (2, '啦啦啦', 1, NULL, NULL, 4, NULL, 999, NULL, NULL, NULL, '2025-08-08 09:22:43', '2025-08-08 09:22:43');
INSERT INTO `ft_person` VALUES (3, '说法萨芬', 0, NULL, NULL, 4, NULL, 999, NULL, NULL, NULL, '2025-08-11 14:13:13', '2025-08-11 14:13:13');
INSERT INTO `ft_person` VALUES (4, '翠花', 0, NULL, NULL, 4, NULL, 999, NULL, NULL, NULL, '2025-08-11 14:19:23', '2025-08-11 14:19:23');
INSERT INTO `ft_person` VALUES (5, '咳咳克', 0, NULL, NULL, 4, NULL, 999, NULL, NULL, NULL, '2025-08-11 15:49:29', '2025-08-11 15:49:29');
INSERT INTO `ft_person` VALUES (6, '狗蛋', 1, NULL, NULL, 4, NULL, 999, NULL, NULL, NULL, '2025-08-11 16:26:48', '2025-08-11 16:26:48');
INSERT INTO `ft_person` VALUES (7, '张一', 1, NULL, NULL, 1, NULL, 999, NULL, NULL, NULL, '2025-08-11 16:27:08', '2025-08-11 16:27:08');
INSERT INTO `ft_person` VALUES (8, '张一1', 1, NULL, NULL, 1, NULL, 999, NULL, NULL, NULL, '2025-08-11 16:27:20', '2025-08-11 16:27:20');
INSERT INTO `ft_person` VALUES (9, '小花花', 0, NULL, NULL, 1, NULL, 999, NULL, NULL, NULL, '2025-08-11 16:27:31', '2025-08-11 16:27:31');
INSERT INTO `ft_person` VALUES (10, '花母', 0, NULL, NULL, 1, NULL, 999, NULL, NULL, NULL, '2025-08-11 16:28:03', '2025-08-11 16:28:03');
INSERT INTO `ft_person` VALUES (11, '王大锤', 1, NULL, NULL, 4, NULL, 999, NULL, NULL, NULL, '2025-08-12 16:58:47', '2025-08-12 16:58:47');

-- ----------------------------
-- Table structure for ft_relationship
-- ----------------------------
DROP TABLE IF EXISTS `ft_relationship`;
CREATE TABLE `ft_relationship`  (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `tree_id` bigint(20) NOT NULL,
  `from_person_id` bigint(20) NOT NULL,
  `to_person_id` bigint(20) NOT NULL,
  `type` varchar(100) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  `higher` bigint(20) NOT NULL,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 25 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci COMMENT = '家谱成员关系表' ROW_FORMAT = Compact;

-- ----------------------------
-- Records of ft_relationship
-- ----------------------------
INSERT INTO `ft_relationship` VALUES (1, 4, 2, 3, '父', 1);
INSERT INTO `ft_relationship` VALUES (2, 4, 3, 2, '女', -1);
INSERT INTO `ft_relationship` VALUES (3, 4, 4, 1, '女', -1);
INSERT INTO `ft_relationship` VALUES (4, 4, 1, 4, '父', 1);
INSERT INTO `ft_relationship` VALUES (5, 4, 2, 1, '父', 1);
INSERT INTO `ft_relationship` VALUES (6, 4, 1, 2, '子', -1);
INSERT INTO `ft_relationship` VALUES (7, 4, 5, 2, '女', -1);
INSERT INTO `ft_relationship` VALUES (8, 4, 2, 5, '父', 1);
INSERT INTO `ft_relationship` VALUES (9, 4, 6, 3, '子', -1);
INSERT INTO `ft_relationship` VALUES (10, 4, 3, 6, '母', 1);
INSERT INTO `ft_relationship` VALUES (11, 1, 8, 7, '子', -1);
INSERT INTO `ft_relationship` VALUES (12, 1, 7, 8, '父', 1);
INSERT INTO `ft_relationship` VALUES (13, 1, 9, 8, '母', 1);
INSERT INTO `ft_relationship` VALUES (14, 1, 8, 9, '子', -1);
INSERT INTO `ft_relationship` VALUES (15, 1, 9, 7, '妻', 0);
INSERT INTO `ft_relationship` VALUES (16, 1, 7, 9, '夫', 0);
INSERT INTO `ft_relationship` VALUES (17, 1, 10, 9, '母', 1);
INSERT INTO `ft_relationship` VALUES (18, 1, 9, 10, '女', -1);
INSERT INTO `ft_relationship` VALUES (19, 4, 1, 3, '夫', 0);
INSERT INTO `ft_relationship` VALUES (20, 4, 3, 1, '妻', 0);
INSERT INTO `ft_relationship` VALUES (21, 4, 6, 5, '夫', 0);
INSERT INTO `ft_relationship` VALUES (22, 4, 5, 6, '妻', 0);
INSERT INTO `ft_relationship` VALUES (23, 4, 11, 6, '子', -1);
INSERT INTO `ft_relationship` VALUES (24, 4, 6, 11, '父', 1);

-- ----------------------------
-- Table structure for ft_tree
-- ----------------------------
DROP TABLE IF EXISTS `ft_tree`;
CREATE TABLE `ft_tree`  (
  `tree_id` bigint(20) NOT NULL AUTO_INCREMENT COMMENT '家谱ID',
  `tree_name` varchar(30) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL COMMENT '家谱名称',
  `tree_desc` text CHARACTER SET utf8 COLLATE utf8_general_ci NULL COMMENT '家谱序',
  `tree_author` bigint(20) NOT NULL COMMENT '作者',
  `create_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `update_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`tree_id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 5 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci COMMENT = '家谱树' ROW_FORMAT = Compact;

-- ----------------------------
-- Records of ft_tree
-- ----------------------------
INSERT INTO `ft_tree` VALUES (1, 'test辣', '233123是否是S', 1, '2025-07-30 09:11:17', '2025-07-30 09:20:58');
INSERT INTO `ft_tree` VALUES (3, '咯咯哒', '6666666666666', 2, '2025-07-30 09:47:17', '2025-07-30 09:47:17');
INSERT INTO `ft_tree` VALUES (4, '是否哈佛', '是否', 1, '2025-07-30 10:15:09', '2025-08-11 13:57:25');

-- ----------------------------
-- Table structure for sys_login_log
-- ----------------------------
DROP TABLE IF EXISTS `sys_login_log`;
CREATE TABLE `sys_login_log`  (
  `login_id` bigint(20) NOT NULL AUTO_INCREMENT COMMENT '访问ID',
  `token` varchar(100) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  `online` tinyint(4) NOT NULL DEFAULT 0 COMMENT 'token状态（0有效 1无效）',
  `user_name` varchar(50) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '用户账号',
  `ipaddr` varchar(128) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '登录IP地址',
  `login_location` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '登录地点',
  `browser` varchar(50) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '浏览器类型',
  `os` varchar(50) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '操作系统',
  `status` tinyint(1) NULL DEFAULT 0 COMMENT '登录状态（0成功 1失败）',
  `msg` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '提示消息',
  `login_time` datetime NULL DEFAULT NULL COMMENT '访问时间',
  `ua` varchar(1000) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '浏览器标识',
  PRIMARY KEY (`login_id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 1 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci COMMENT = '登录日志表' ROW_FORMAT = Compact;

-- ----------------------------
-- Records of sys_login_log
-- ----------------------------

-- ----------------------------
-- Table structure for sys_menu
-- ----------------------------
DROP TABLE IF EXISTS `sys_menu`;
CREATE TABLE `sys_menu`  (
  `menu_id` bigint(20) NOT NULL AUTO_INCREMENT,
  `parent_id` bigint(20) NULL DEFAULT 0 COMMENT '父级id',
  `menu_name` varchar(50) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL COMMENT '名称',
  `order_num` int(4) NULL DEFAULT 0 COMMENT '排序权值',
  `menu_type` enum('M','C','A','L') CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL COMMENT 'M目录 C菜单 A按钮 L外链',
  `icon` varchar(100) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '图标',
  `path` varchar(200) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '路由地址',
  `component` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '组件地址',
  `permit` varchar(100) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '权限标识',
  `api` varchar(500) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '对应接口',
  `is_activated` tinyint(1) NULL DEFAULT NULL COMMENT '是否启用（0是 1否）',
  `is_menu` tinyint(1) NULL DEFAULT NULL COMMENT '是否显示到菜单（0是 1否）',
  `is_cached` tinyint(1) NULL DEFAULT NULL COMMENT '是否缓存（0是 1否）',
  `create_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `update_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`menu_id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 51 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci COMMENT = '菜单权限表' ROW_FORMAT = Compact;

-- ----------------------------
-- Records of sys_menu
-- ----------------------------
INSERT INTO `sys_menu` VALUES (1, 0, '系统管理', 1, 'M', 'pc', '/system', 'Layout', NULL, NULL, 0, 0, 1, '2022-01-14 20:41:26', '2022-11-19 18:45:59');
INSERT INTO `sys_menu` VALUES (2, 1, '菜单管理', 0, 'C', 'tree-table', '/system/menu', 'system/SystemMenu', NULL, '/manage-api/menu/listMenu', 0, 0, 0, '2022-01-14 20:41:26', '2022-02-24 23:03:54');
INSERT INTO `sys_menu` VALUES (3, 1, '角色管理', 1, 'C', 'peoples', '/system/role', 'system/SystemRole', NULL, '/manage-api/role/listRole', 0, 0, 0, '2022-01-14 20:41:26', '2022-02-24 23:03:16');
INSERT INTO `sys_menu` VALUES (4, 1, '用户管理', 2, 'C', 'user', '/system/user', 'system/SystemUser', NULL, '/manage-api/user/listUser', 0, 0, 0, '2022-01-14 20:41:26', '2022-02-24 23:02:53');
INSERT INTO `sys_menu` VALUES (5, 2, '菜单添加', 0, 'A', NULL, NULL, NULL, 'system:menu:add', '/manage-api/menu/addMenu', 0, NULL, NULL, '2022-01-14 20:41:26', '2022-01-14 21:47:00');
INSERT INTO `sys_menu` VALUES (6, 2, '菜单修改', 0, 'A', NULL, NULL, NULL, 'system:menu:modify', '/manage-api/menu/modifyMenu', 0, NULL, NULL, '2022-01-14 20:41:26', '2022-01-14 21:46:36');
INSERT INTO `sys_menu` VALUES (7, 2, '菜单删除', 0, 'A', NULL, NULL, NULL, 'system:menu:delete', '/manage-api/menu/deleteMenu', 0, NULL, NULL, '2022-01-14 20:41:26', '2022-01-14 20:41:26');
INSERT INTO `sys_menu` VALUES (8, 3, '角色添加', 0, 'A', NULL, NULL, NULL, 'system:role:add', '/manage-api/role/addRole,/manage-api/menu/listSimpleMenu', 0, NULL, NULL, '2022-01-14 20:41:26', '2022-01-14 23:16:32');
INSERT INTO `sys_menu` VALUES (9, 3, '角色修改', 0, 'A', NULL, NULL, NULL, 'system:role:modify', '/manage-api/role/modifyRole,/manage-api/menu/listSimpleMenu', 0, NULL, NULL, '2022-01-14 20:41:26', '2022-01-14 23:16:43');
INSERT INTO `sys_menu` VALUES (10, 3, '角色删除', 0, 'A', NULL, NULL, NULL, 'system:role:delete', '/manage-api/role/deleteRole', 0, NULL, NULL, '2022-01-14 20:41:26', '2022-01-14 20:41:26');
INSERT INTO `sys_menu` VALUES (11, 4, '用户添加', 0, 'A', NULL, NULL, NULL, 'system:user:add', '/manage-api/user/addUser,/manage-api/role/listSimpleRole', 0, NULL, NULL, '2022-01-14 20:41:26', '2022-01-14 23:03:17');
INSERT INTO `sys_menu` VALUES (12, 4, '用户修改', 0, 'A', NULL, NULL, NULL, 'system:user:modify', '/manage-api/user/modifyUser,/manage-api/role/listSimpleRole', 0, NULL, NULL, '2022-01-14 20:41:26', '2022-01-14 23:03:28');
INSERT INTO `sys_menu` VALUES (13, 4, '用户删除', 0, 'A', NULL, NULL, NULL, 'system:user:delete', '/manage-api/user/deleteUser', 0, NULL, NULL, '2022-01-14 20:41:26', '2022-01-14 20:41:26');
INSERT INTO `sys_menu` VALUES (14, 2, '菜单排序', 0, 'A', NULL, NULL, NULL, 'system:menu:order', '/manage-api/menu/modifyMenuOrder', 0, NULL, NULL, '2022-01-14 20:41:26', '2022-01-22 21:11:26');
INSERT INTO `sys_menu` VALUES (15, 0, 'Gitee仓库', 0, 'L', 'github', 'https://gitee.com/jianggle/efly-system', NULL, NULL, NULL, 0, 0, NULL, '2022-01-14 20:41:26', '2022-09-16 22:42:06');
INSERT INTO `sys_menu` VALUES (16, 1, '登录日志', 4, 'C', 'logininfor', '/system/log/login', 'system/SystemLogLogin', NULL, '/manage-api/log/listLoginLog', 0, 0, 0, '2022-02-18 15:25:33', '2022-02-24 23:04:57');
INSERT INTO `sys_menu` VALUES (18, 1, '在线用户', 3, 'C', 'people', '/system/user/online', 'system/SystemUserOnline.vue', NULL, '/manage-api/user/listOnlineUser', 0, 0, 0, '2022-02-18 20:01:13', '2022-02-24 23:02:07');
INSERT INTO `sys_menu` VALUES (19, 18, '强制退出', 0, 'A', NULL, NULL, NULL, 'system:user:forceLogout', '/manage-api/user/deleteOnlineUser', 0, NULL, NULL, '2022-02-18 22:08:48', '2022-02-18 22:19:59');
INSERT INTO `sys_menu` VALUES (20, 0, '内容管理', 2, 'M', 'education', '/cms', 'Layout', NULL, NULL, 0, 0, 1, '2022-02-21 15:19:30', '2022-11-20 22:19:47');
INSERT INTO `sys_menu` VALUES (21, 20, '文章管理', 0, 'C', 'form', '/cms/article', 'cms/CmsArticle', NULL, '/manage-api/cms/listCmsArticle', 0, 0, 0, '2022-02-21 15:22:30', '2022-11-20 22:19:54');
INSERT INTO `sys_menu` VALUES (22, 20, '分类管理', 0, 'C', 'category', '/cms/category', 'cms/CmsCategory', NULL, '/manage-api/cms/listCmsCategory', 0, 0, 0, '2022-02-21 15:24:28', '2022-09-14 21:43:48');
INSERT INTO `sys_menu` VALUES (23, 20, '标签管理', 0, 'C', 'tag', '/cms/tag', 'cms/CmsTag', NULL, '/manage-api/cms/listCmsTag', 0, 0, 0, '2022-02-21 15:27:27', '2022-09-14 21:43:53');
INSERT INTO `sys_menu` VALUES (24, 25, '链接列表', 0, 'C', NULL, '/cms/link/list', 'cms/CmsLinkList', NULL, '/manage-api/cms/listCmsLink,/manage-api/cms/listCmsLinkCategory', 0, 0, 0, '2022-02-21 15:29:15', '2022-09-14 21:44:02');
INSERT INTO `sys_menu` VALUES (25, 20, '链接管理', 0, 'M', 'link', '/cms/link', 'ParentView', NULL, NULL, 0, 0, 1, '2022-02-21 15:30:54', '2022-09-13 21:07:31');
INSERT INTO `sys_menu` VALUES (26, 23, '添加标签', 0, 'A', NULL, NULL, NULL, 'cms:tag:add', '/manage-api/cms/addCmsTag', 0, NULL, NULL, '2022-02-21 17:40:10', '2022-09-14 21:44:08');
INSERT INTO `sys_menu` VALUES (27, 23, '修改标签', 0, 'A', NULL, NULL, NULL, 'cms:tag:modify', '/manage-api/cms/modifyCmsTag', 0, NULL, NULL, '2022-02-21 17:40:58', '2022-09-14 21:44:11');
INSERT INTO `sys_menu` VALUES (28, 23, '删除标签', 0, 'A', NULL, NULL, NULL, 'cms:tag:delete', '/manage-api/cms/removeCmsTag', 0, NULL, NULL, '2022-02-21 17:41:20', '2022-09-14 21:44:14');
INSERT INTO `sys_menu` VALUES (29, 22, '添加文章分类', 0, 'A', NULL, NULL, NULL, 'cms:category:add', '/manage-api/cms/addCmsCategory', 0, NULL, NULL, '2022-02-21 19:32:36', '2022-09-14 21:44:18');
INSERT INTO `sys_menu` VALUES (30, 22, '修改文章分类', 0, 'A', NULL, NULL, NULL, 'cms:category:modify', '/manage-api/cms/modifyCmsCategory', 0, NULL, NULL, '2022-02-21 19:33:13', '2022-09-14 21:44:22');
INSERT INTO `sys_menu` VALUES (31, 22, '删除文章分类', 0, 'A', NULL, NULL, NULL, 'cms:category:delete', '/manage-api/cms/removeCmsCategory', 0, NULL, NULL, '2022-02-21 19:33:46', '2022-09-14 21:44:34');
INSERT INTO `sys_menu` VALUES (32, 22, '排序文章分类', 0, 'A', NULL, NULL, NULL, 'cms:category:order', '/manage-api/cms/orderCmsCategory', 0, NULL, NULL, '2022-02-21 19:35:50', '2022-09-14 21:44:38');
INSERT INTO `sys_menu` VALUES (34, 21, '批量操作文章', 0, 'A', NULL, NULL, NULL, 'cms:article:batchOperate', '/manage-api/cms/batchOperateCmsArticle', 0, NULL, NULL, '2022-02-22 01:00:32', '2022-09-14 21:44:43');
INSERT INTO `sys_menu` VALUES (35, 21, '切换文章状态', 0, 'A', NULL, NULL, NULL, 'cms:article:updateStatus', '/manage-api/cms/updateCmsArticleStatus', 0, NULL, NULL, '2022-02-22 01:03:36', '2022-09-14 21:44:47');
INSERT INTO `sys_menu` VALUES (36, 21, '添加文章', 0, 'A', NULL, NULL, NULL, 'cms:article:add', '/manage-api/cms/infoCmsArticle,/manage-api/cms/addCmsArticle,/manage-api/cms/uploadFile', 0, NULL, NULL, '2022-02-22 06:47:43', '2022-09-14 21:45:01');
INSERT INTO `sys_menu` VALUES (37, 21, '修改文章', 0, 'A', NULL, NULL, NULL, 'cms:article:modify', '/manage-api/cms/infoCmsArticle,/manage-api/cms/modifyCmsArticle,/manage-api/cms/uploadFile', 0, NULL, NULL, '2022-02-22 09:06:44', '2022-09-14 21:45:11');
INSERT INTO `sys_menu` VALUES (38, 25, '链接分类', 0, 'C', NULL, '/cms/link/category', 'cms/CmsLinkCategory', NULL, '/manage-api/cms/listCmsLinkCategory', 0, 0, 0, '2022-02-24 16:42:27', '2022-09-14 21:45:15');
INSERT INTO `sys_menu` VALUES (39, 38, '添加链接分类', 0, 'A', NULL, NULL, NULL, 'cms:link:addCategory', '/manage-api/cms/addCmsLinkCategory', 0, NULL, NULL, '2022-02-24 17:26:44', '2022-09-14 21:45:19');
INSERT INTO `sys_menu` VALUES (40, 38, '删除链接分类', 0, 'A', NULL, NULL, NULL, 'cms:link:deleteCategory', '/manage-api/cms/removeCmsLinkCategory', 0, NULL, NULL, '2022-02-24 17:27:26', '2022-09-14 21:45:23');
INSERT INTO `sys_menu` VALUES (41, 38, '排序链接分类', 0, 'A', NULL, NULL, NULL, 'cms:link:orderCategory', '/manage-api/cms/orderCmsLinkCategory', 0, NULL, NULL, '2022-02-24 17:28:07', '2022-09-14 21:45:28');
INSERT INTO `sys_menu` VALUES (42, 38, '修改链接分类', 0, 'A', NULL, NULL, NULL, 'cms:link:modifyCategory', '/manage-api/cms/modifyCmsLinkCategory', 0, NULL, NULL, '2022-02-24 17:29:10', '2022-09-14 21:45:31');
INSERT INTO `sys_menu` VALUES (43, 24, '添加链接', 0, 'A', NULL, NULL, NULL, 'cms:link:add', '/manage-api/cms/addCmsLink', 0, NULL, NULL, '2022-02-24 19:02:43', '2022-09-14 21:45:35');
INSERT INTO `sys_menu` VALUES (44, 24, '修改链接', 0, 'A', NULL, NULL, NULL, 'cms:link:modify', '/manage-api/cms/modifyCmsLink', 0, NULL, NULL, '2022-02-24 19:03:17', '2022-09-14 21:45:39');
INSERT INTO `sys_menu` VALUES (45, 24, '切换链接状态', 0, 'A', NULL, NULL, NULL, 'cms:link:updateStatus', '/manage-api/cms/updateCmsLinkStatus', 0, NULL, NULL, '2022-02-24 19:24:00', '2022-09-14 21:45:43');
INSERT INTO `sys_menu` VALUES (46, 24, '批量操作链接', 0, 'A', NULL, NULL, NULL, 'cms:link:batchOperate', '/manage-api/cms/batchOperateCmsLink', 0, NULL, NULL, '2022-03-01 05:36:59', '2022-09-14 21:45:48');
INSERT INTO `sys_menu` VALUES (47, 24, '排序链接', 0, 'A', NULL, NULL, NULL, 'cms:link:order', '/manage-api/cms/orderCmsLink', 0, NULL, NULL, '2022-03-01 05:37:42', '2022-09-14 21:45:52');
INSERT INTO `sys_menu` VALUES (48, 0, '家谱管理', 5, 'M', 'tree', '/ftree', 'Layout', NULL, NULL, 0, 0, 1, '2025-07-29 16:55:13', '2025-07-30 10:35:28');
INSERT INTO `sys_menu` VALUES (49, 48, '我的家谱', 0, 'C', 'tree-table', '/ftree/index', 'ftree/FamilyTree', NULL, '/manage-api/ftree/listFtTree,/manage-api/ftree/removeFtTree,/manage-api/ftree/addFtTree,/manage-api/ftree/modifyFtTree', 0, 0, 1, '2025-07-29 17:15:11', '2025-08-19 10:40:24');
INSERT INTO `sys_menu` VALUES (50, 48, '工作台', 0, 'C', 'edit', '/ftree/desk', 'ftree/FamilyTreeDesk', NULL, '/manage-api/ftree/addFtPerson,/manage-api/ftree/getRelationBySex,/manage-api/ftree/getRelationBySingleSex,/manage-api/ftree/buildFtRelation,/manage-api/ftree/addFtRelation,/manage-api/ftree/getFtTreeById', 0, 0, 1, '2025-07-31 10:35:25', '2025-08-19 10:40:16');

-- ----------------------------
-- Table structure for sys_role
-- ----------------------------
DROP TABLE IF EXISTS `sys_role`;
CREATE TABLE `sys_role`  (
  `role_id` bigint(20) NOT NULL AUTO_INCREMENT COMMENT '角色ID',
  `role_name` varchar(30) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL COMMENT '角色名称',
  `status` tinyint(1) NOT NULL DEFAULT 1 COMMENT '角色状态（0正常 1停用）',
  `remark` varchar(140) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '备注',
  `is_system` tinyint(1) NOT NULL DEFAULT 1 COMMENT '系统角色（0是 1否）',
  `del_flag` tinyint(1) NOT NULL DEFAULT 0 COMMENT '删除标志（0存在 1删除）',
  `create_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `update_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`role_id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 8 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci COMMENT = '角色信息表' ROW_FORMAT = Compact;

-- ----------------------------
-- Records of sys_role
-- ----------------------------
INSERT INTO `sys_role` VALUES (1, '超级管理员', 0, '拥有系统全部权限', 0, 0, '2018-01-01 12:13:14', '2022-01-14 23:25:58');
INSERT INTO `sys_role` VALUES (2, '普通角色', 0, 'this is a normal role', 1, 0, '2018-03-16 11:33:00', '2022-02-18 03:23:17');
INSERT INTO `sys_role` VALUES (3, '博客作者', 0, '博客管理专用', 1, 0, '2020-08-10 00:00:00', '2022-02-21 18:27:59');
INSERT INTO `sys_role` VALUES (4, 'test新建', 1, 'test sth ing...123', 1, 0, '2021-05-15 15:56:17', '2022-02-18 03:30:28');
INSERT INTO `sys_role` VALUES (5, 'test加角色', 1, '呱呱呱呱呱呱', 1, 0, '2022-09-13 18:50:50', '2022-09-13 18:51:38');

-- ----------------------------
-- Table structure for sys_role_menu
-- ----------------------------
DROP TABLE IF EXISTS `sys_role_menu`;
CREATE TABLE `sys_role_menu`  (
  `role_id` bigint(20) NOT NULL COMMENT '角色ID',
  `menu_id` bigint(20) NOT NULL COMMENT '菜单ID',
  PRIMARY KEY (`role_id`, `menu_id`) USING BTREE
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci COMMENT = '角色和菜单关联表' ROW_FORMAT = Compact;

-- ----------------------------
-- Records of sys_role_menu
-- ----------------------------
INSERT INTO `sys_role_menu` VALUES (2, 15);
INSERT INTO `sys_role_menu` VALUES (2, 48);
INSERT INTO `sys_role_menu` VALUES (2, 49);
INSERT INTO `sys_role_menu` VALUES (3, 20);
INSERT INTO `sys_role_menu` VALUES (3, 21);
INSERT INTO `sys_role_menu` VALUES (3, 22);
INSERT INTO `sys_role_menu` VALUES (3, 23);
INSERT INTO `sys_role_menu` VALUES (3, 26);
INSERT INTO `sys_role_menu` VALUES (3, 27);
INSERT INTO `sys_role_menu` VALUES (3, 28);
INSERT INTO `sys_role_menu` VALUES (3, 29);
INSERT INTO `sys_role_menu` VALUES (3, 30);
INSERT INTO `sys_role_menu` VALUES (3, 31);
INSERT INTO `sys_role_menu` VALUES (3, 32);
INSERT INTO `sys_role_menu` VALUES (3, 34);
INSERT INTO `sys_role_menu` VALUES (3, 35);
INSERT INTO `sys_role_menu` VALUES (3, 36);
INSERT INTO `sys_role_menu` VALUES (3, 37);
INSERT INTO `sys_role_menu` VALUES (4, 1);
INSERT INTO `sys_role_menu` VALUES (4, 2);
INSERT INTO `sys_role_menu` VALUES (4, 3);
INSERT INTO `sys_role_menu` VALUES (4, 4);
INSERT INTO `sys_role_menu` VALUES (4, 5);
INSERT INTO `sys_role_menu` VALUES (4, 6);
INSERT INTO `sys_role_menu` VALUES (4, 7);
INSERT INTO `sys_role_menu` VALUES (4, 8);
INSERT INTO `sys_role_menu` VALUES (4, 9);
INSERT INTO `sys_role_menu` VALUES (4, 10);
INSERT INTO `sys_role_menu` VALUES (4, 11);
INSERT INTO `sys_role_menu` VALUES (4, 12);
INSERT INTO `sys_role_menu` VALUES (4, 13);
INSERT INTO `sys_role_menu` VALUES (4, 14);
INSERT INTO `sys_role_menu` VALUES (4, 15);
INSERT INTO `sys_role_menu` VALUES (5, 15);

-- ----------------------------
-- Table structure for sys_user
-- ----------------------------
DROP TABLE IF EXISTS `sys_user`;
CREATE TABLE `sys_user`  (
  `user_id` bigint(20) NOT NULL AUTO_INCREMENT COMMENT '用户ID',
  `user_name` varchar(30) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL COMMENT '用户账号',
  `password` varchar(100) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL COMMENT '密码',
  `salt` varchar(100) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL COMMENT '盐',
  `real_name` varchar(30) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL COMMENT '真实姓名',
  `phone` varchar(11) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL COMMENT '手机号码',
  `avatar` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '头像',
  `status` tinyint(1) NOT NULL DEFAULT 1 COMMENT '账号状态（0正常 1停用）',
  `setting` text CHARACTER SET utf8 COLLATE utf8_general_ci NULL COMMENT '设置',
  `license_code` text CHARACTER SET utf8 COLLATE utf8_general_ci NULL COMMENT '许可证',
  `is_system` tinyint(1) NOT NULL DEFAULT 1 COMMENT '系统人员（0是 1否）',
  `del_flag` tinyint(1) NOT NULL DEFAULT 0 COMMENT '删除标志（0存在 1删除）',
  `login_ip` varchar(50) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT '' COMMENT '最后登陆IP',
  `login_date` datetime NULL DEFAULT NULL COMMENT '最后登陆时间',
  `create_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `update_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`user_id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 2 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci COMMENT = '用户信息表' ROW_FORMAT = Compact;

-- ----------------------------
-- Records of sys_user
-- ----------------------------
INSERT INTO `sys_user` VALUES (1, 'admin', 'dfee5e54d330d2f9bee908735112aacf', '1501e885bfa99cbcadd617e14f8108be', '张三', '18408279998', 'https://img.jianggle.com/avatar_202307_1689728764881', 0, '', NULL, 0, 0, NULL, '2026-11-26 10:22:55', '2020-02-01 00:00:00', '2026-11-26 10:22:55');

-- ----------------------------
-- Table structure for sys_user_role
-- ----------------------------
DROP TABLE IF EXISTS `sys_user_role`;
CREATE TABLE `sys_user_role`  (
  `user_id` bigint(20) NOT NULL COMMENT '用户ID',
  `role_id` bigint(20) NOT NULL COMMENT '角色ID',
  PRIMARY KEY (`user_id`, `role_id`) USING BTREE
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci COMMENT = '用户和角色关联表' ROW_FORMAT = Compact;

-- ----------------------------
-- Records of sys_user_role
-- ----------------------------
INSERT INTO `sys_user_role` VALUES (1, 1);

SET FOREIGN_KEY_CHECKS = 1;
