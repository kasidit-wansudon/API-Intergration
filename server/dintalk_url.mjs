class DingTalkUrl {
  constructor() {
    this.baseUrl = "https://oapi.dingtalk.com/topapi/v2/";
    this.endUrl = "?access_token=";
  }
  #getUrl(endpoint) {
    return this.baseUrl + endpoint + this.endUrl;
  }
  // Use a getter for each endpoint
  get getUser() {
    return this.#getUrl("user/list");
  }

  get createUser() {
    return this.#getUrl("user/create");
  }
  get updateUser() {
    return this.#getUrl("user/update");
  }
  get inviteStatus() {
    return this.#getUrl("invite/status");
  }
  get getUserById() {
    return this.#getUrl("user/get");
  }
  get sendInvite() {
    return this.#getUrl("invite/send");
  }
  get listAllDepartments() {
    return this.#getUrl("department/listsub");
  }
  get getDepartment() {
    return this.#getUrl("department/get");
  }
  get createDepartment() {
    return this.#getUrl("department/create");
  }
  get updateDepartment() {
    return this.#getUrl("department/update");
  }
  get addUserToDepartment() {
    return this.#getUrl("department/member/add");
  }
  get listSubDepartmentIds() {
    return this.#getUrl("department/list_sub_id");
  }
}

export default DingTalkUrl;
