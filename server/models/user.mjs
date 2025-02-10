// account.mjs
class Account {
  constructor(data = {}) {
    const initData = {
      exclusive_account_type: "dingtalk",
      email: "kasidid.wan@gmail.com",
      init_password: "12345678dingding", // **IMPORTANT: DO NOT STORE PLAIN TEXT PASSWORDS**
      telephone: "+66637902362",
      login_id: "dingding",
      extension: '{"爱好":"旅游","年龄":"24"}', // Consider storing as an object
      exclusive_account: true, // Use boolean, not string
      remark: "备注信息",
      hired_date: 1650351000000, // Use number, not string
      manager_userid: "23561022256475187",
      title: "技术总监",
      org_email_type: "base",
      userid: "123456789", // This should be provided by DingTalk, not initialized here
      avatarMediaId: "@lADPDfYH3A-xxxx",
      work_place: "北京",
      senior_mode: false, // Use boolean
      org_email: "ceshi2",
      name: "Hello3 phone",
      nickname: "小钉1",
      mobile: "+66637902362",
      exclusive_mobile: "+66637902362",
      dept_id_list: "978501722", // Consider storing as an array of numbers
      job_number: "123",
    };

    // Merge the provided data with the default data, prioritizing the provided data.
    this.data = { ...initData, ...data };

    // --- Input Validation and Type Coercion (IMPORTANT) ---
    this.validateAndCoerce();

    // Set job_number to be the same as login_id if job_number is not provided.
    if (!this.data.job_number) {
      this.data.job_number = this.data.login_id;
    }
  }
  validateAndCoerce() {
    // Validate and coerce types
    const d = this.data; // For brevity

    d.exclusive_account_type = d.exclusive_account_type
      ? String(d.exclusive_account_type)
      : null;
    d.email = d.email ? String(d.email) : null;
    d.init_password = d.init_password ? String(d.init_password) : null; //Again, DO NOT STORE
    d.telephone = d.telephone ? String(d.telephone) : null;
    d.login_id = d.login_id ? String(d.login_id) : null;
    d.extension = d.extension ? String(d.extension) : null;
    d.exclusive_account = !!d.exclusive_account; // Coerce to boolean
    d.remark = d.remark ? String(d.remark) : null;
    d.hired_date = d.hired_date ? Number(d.hired_date) : null;
    d.manager_userid = d.manager_userid ? String(d.manager_userid) : null;
    d.title = d.title ? String(d.title) : null;
    d.org_email_type = d.org_email_type ? String(d.org_email_type) : null;
    d.userid = d.userid ? String(d.userid) : null; // Should come from DingTalk
    d.avatarMediaId = d.avatarMediaId ? String(d.avatarMediaId) : null;
    d.work_place = d.work_place ? String(d.work_place) : null;
    d.senior_mode = !!d.senior_mode; // Coerce to boolean
    d.org_email = d.org_email ? String(d.org_email) : null;
    d.name = d.name ? String(d.name) : null;
    d.nickname = d.nickname ? String(d.nickname) : null;
    d.mobile = d.mobile ? String(d.mobile) : null;
    d.exclusive_mobile = d.exclusive_mobile ? String(d.exclusive_mobile) : null;
    d.dept_id_list = d.dept_id_list ? String(d.dept_id_list) : null; // Keep as string initially
    d.job_number = d.job_number ? String(d.job_number) : null;

    // Further validation (examples):
    if (d.email && !/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(d.email)) {
      // Basic email validation
      console.warn("Invalid email format:", d.email);
      //  throw new Error("Invalid email format"); // Or handle more gracefully
    }
    if (d.mobile && !/^\+?[0-9]{1,3}[0-9-]{4,14}$/.test(d.mobile)) {
      // Basic Mobile format
      console.warn("Invalid mobile format:", d.mobile);
    }
    if (d.telephone && !/^\+?[0-9]{1,3}[0-9-]{4,14}$/.test(d.telephone)) {
      // Basic telephone format
      console.warn("Invalid telephone format:", d.telephone);
    }
    if (
      d.exclusive_mobile &&
      !/^\+?[0-9]{1,3}[0-9-]{4,14}$/.test(d.exclusive_mobile)
    ) {
      // Basic exclusive_mobile format
      console.warn("Invalid exclusive_mobile format:", d.exclusive_mobile);
    }
    // Add more validation rules as needed (e.g., for hired_date, etc.)
  }
  /**
   * Gets the raw data object.
   *
   * @returns {object}
   */
  getData() {
    return this.data;
  }
  /**
   * Gets a specific property from the data.
   * @param {string} key The name of the property.
   * @returns {*} The value of the property, or undefined if not found.
   */
  get(key) {
    return this.data[key];
  }

  /**
   * Sets a specific property in the data.
   * @param {string} key The name of the property.
   * @param {*} value The new value of the property.
   * @returns {Account}  Returns the Account instance for chaining.
   */
  set(key, value) {
    this.data[key] = value;
    this.validateAndCoerce(); // Re-validate after setting
    return this; // Allow method chaining
  }

  /**
   * Gets the extension data as an object.
   * @returns {object|null} The parsed extension data, or null on error.
   */
  getExtensionData() {
    try {
      return JSON.parse(this.data.extension);
    } catch (error) {
      console.error("Invalid JSON in extension:", this.data.extension, error);
      return null;
    }
  }
  /**
   * Sets the extension data
   * @param {object} data
   * @returns {object|null} The parsed extension data, or null on error.
   */
  setExtensionData(data) {
    if (!data || typeof data !== "object") {
      console.warn(
        "Invalid data provided to setExtensionData.  Must be an object."
      );
      return this; // Or throw error
    }
    try {
      this.data.extension = JSON.stringify(data);
    } catch (error) {
      console.error("setExtensionData error", error);
      return null;
    }
    return this;
  }

  /**
   * Get the department IDs as an array.
   *
   * @return {number[]|null} An array of department IDs, or null if dept_id_list is not set.
   */
  getDeptIdListArray() {
    if (!this.data.dept_id_list) {
      return null;
    }
    return this.data.dept_id_list
      .split(",")
      .map(Number)
      .filter((id) => !isNaN(id));
  }

  /**
   * Set the department ID list from an array.
   *
   * @param {number[]} deptIds An array of department IDs.  Non-numeric values will be filtered out.
   * @return {this}
   */
  setDeptIdListFromArray(deptIds) {
    if (!Array.isArray(deptIds)) {
      console.warn("setDeptIdListFromArray: Input must be an array.");
      return this; // Or throw an error
    }
    this.data.dept_id_list = deptIds
      .filter((id) => typeof id === "number" && !isNaN(id))
      .join(",");
    return this;
  }

  /**
   * Converts the account data to a plain object, suitable for sending to the DingTalk API.
   * Performs necessary transformations (e.g., array to comma-separated string).
   *
   * @returns {object} The object ready for the API.
   */
  toApiObject() {
    const apiData = { ...this.data }; // Create a copy to avoid modifying the original

    // Convert dept_id_list to comma-separated string if it's an array
    if (Array.isArray(apiData.dept_id_list)) {
      apiData.dept_id_list = apiData.dept_id_list.join(",");
    }
    //Convert extension to string
    if (typeof apiData.extension == "object") {
      apiData.extension = this.setExtensionData(apiData.extension);
    }

    return apiData;
  }
}

export default Account;