interface BasicOption {
  label: string;
  value: string;
}

type SelectOption = BasicOption;

type TabOption = BasicOption;

// 按钮权限
interface roleBtn {
  /**
   * 按钮id
   */
  id: string;
  /**
   * 按钮编号
   */
  btn_code: string;
  /**
   * 按钮名称
   */
  btn_name: string;
}

// 菜单权限
interface roleMenu {
  /**
   * 菜单id
   */
  menu_id: string;
  /**
   * 菜单名称
   */
  menu_title: string;
  /**
   * 路由name
   */
  route_name: string;
  /**
   * 路由path
   */
  route_path: string;
  /**
   * 排序
   */
  sort: number;
  /**
   * 菜单按钮
   */
  menu_btn: roleBtn[];
}

interface BasicUserInfo {
  [key: string]: any;
  /**
   * 用户id
   */
  id: string;
  /**
   * 用户名
   */
  username: string;
  /**
   * 用户昵称
   */
  nick_name: string;
  /**
   * 头像
   */
  avatar: string;
  /**
   * 用户邮箱
   */
  email: string;
  /**
   * 用户手机号
   */
  phone: string;
  /**
   * 用户角色
   */
  user_role: [];
  /**
   * 菜单权限
   */
  role_menu: roleMenu[];
}

type ClassType = Array<object | string> | object | string;

export type {
  BasicOption,
  BasicUserInfo,
  ClassType,
  SelectOption,
  TabOption,
  roleMenu,
};
