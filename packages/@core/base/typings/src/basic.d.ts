interface BasicOption {
  label: string;
  value: string;
}

type SelectOption = BasicOption;

type TabOption = BasicOption;

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
  role_menu: [];
}

type ClassType = Array<object | string> | object | string;

export type { BasicOption, BasicUserInfo, ClassType, SelectOption, TabOption };
