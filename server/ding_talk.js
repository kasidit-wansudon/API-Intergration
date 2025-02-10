import express from "express";
import bodyParser from "body-parser";
import axios from "axios";
import DingTalkUrl from "./dintalk_url.mjs"; // Use .mjs extension
import DingTalkEncryptor from "dingtalk-encrypt"; //Use import
import * as dotenv from "dotenv"; // Import for loading environment variables
// models
import Account from "./models/user.mjs";
dotenv.config(); // Load .env file

const app = express();
app.use(bodyParser.json());

// Access environment variables:
const token = process.env.TOKEN;
const encodingAesKey = process.env.ENCODING_AES_KEY;
const appKey = process.env.APP_KEY;
const appSecret = process.env.APP_SECRET;
const port = process.env.PORT || 3000; // Use a default value if PORT is not set
const url = new DingTalkUrl();

const encryptor = new DingTalkEncryptor(token, encodingAesKey, appKey);

async function decrypt(req, res) {
  const { signature, timestamp, nonce, encrypt } = req.body;
  const aesKey = encodingAesKey;

  if (!encrypt || !aesKey) {
    return res
      .status(400)
      .json({ message: "Missing parameters: encrypt or aesKey" });
  }

  try {
    const plainText = encryptor.getDecryptMsg(
      signature,
      timestamp,
      nonce,
      encrypt
    );

    const decodeObject = JSON.parse(plainText);
    // return res.json(decodeObject);
    if (decodeObject["EventType"] === "check_url") {
      let response = encryptor.getEncryptedMap(
        "success",
        timestamp,
        utils.getRandomStr(8)
      );
      return res.json(response);
    }
    return res.json(plainText);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}

async function getAccessToken() {
  const response = await axios.get(
    `https://oapi.dingtalk.com/gettoken?appkey=${appKey}&appsecret=${appSecret}`
  );
  return response.data.access_token;
}

async function callApiFoundation(url_api, body) {
  const accessToken = await getAccessToken();
  console.log(accessToken);
  const url = `${url_api}${accessToken}`;
  const response = await axios.post(url, body);
  return response.data;
}

async function createDingTalkUser(req, res) {
  try {
    const initData = Account(req.body);
    const userData = { ...initData, ...req.body };
    userData.job_number = userData.login_id;
    console.log("User Data:", userData);
    console.log("Body:", req.body);
    // return res.json(userData);
    const result = await callApiFoundation(URL_CREATE_USER, userData);
    console.log("User Creation Result:", result);
    return res.json(result);
  } catch (error) {
    console.error("Error:", error.message);
    res.json({ error: error.message }, 500);
  }
}

async function getUser(req, res) {
  try {
    const result = await callApiFoundation(url.getUser, req.body, res);
    return res.json(result);
  } catch (error) {
    console.error("Error:", error.message);
    res.json({ error: error.message }, 500);
  }
}

async function getUserId(req, res) {
  try {
    const result = await callApiFoundation(URL_GET_USER_ID, req.body);
    return res.json(result);
  } catch (error) {
    console.error("Error:", error.message);
    res.json({ error: error.message }, 500);
  }
}

async function getStatusUser(req, res) {
  try {
    const result = await callApiFoundation(url.getStatus, req.body);
    return res.json(result);
  } catch (error) {
    console.error("Error:", error.message);
    res.json({ error: error.message }, 500);
  }
}

async function createDepartment(req, res) {
  try {
    const result = await callApiFoundation(url.createDepartment, req.body);
    return res.json(result);
  } catch (error) {
    console.error("Error:", error.message);
    res.json({ error: error.message }, 500);
  }
}

async function getAllDepartment(req, res) {
  try {
    const result = await callApiFoundation(url.listAllDepartments, req.body);
    return res.json(result);
  } catch (error) {
    console.error("Error:", error.message);
    res.json({ error: error.message }, 500);
  }
}

async function getDepartment(req, res) {
  try {
    const result = await callApiFoundation(url.getDepartment, req.body);
    return res.json(result);
  } catch (error) {
    console.error("Error:", error.message);
    res.json({ error: error.message }, 500);
  }
}

// for update name and add manager to department
async function updateDepartment(req, res) {
  try {
    const result = await callApiFoundation(url.updateDepartment, req.body);
    return res.json(result);
  } catch (error) {
    console.error("Error:", error.message);
    res.json({ error: error.message }, 500);
  }
}

async function updateUser(req, res) {
  try {
    const result = await callApiFoundation(url.updateUser, req.body);
    return res.json(result);
  } catch (error) {
    console.error("Error:", error.message);
    res.json({ error: error.message }, 500);
  }
}

async function getUserByLoginName(req, res) {
  try {
    const loginName = req.body.staff_code;
    const dept_id = req.body.dept_id;
    const accessToken = await getAccessToken();
    let cursor = 0;
    const pageSize = 100;

    do {
      const response = await axios.post(
        `${url.getUser}${accessToken}`,
        {
          dept_id: dept_id, // Start with root department
          cursor: cursor,
          size: pageSize,
        },
        {
          params: { access_token: accessToken },
          headers: { "Content-Type": "application/json" },
        }
      );

      const result = response.data;

      if (result.errcode !== 0) {
        throw new Error(`Failed to get user list: ${result.errmsg}`);
      }

      if (!result.result || !result.result.list) {
        throw new Error(`Could not get list user data: ${result.errmsg}`);
      }

      for (const user of result.result.list) {
        console.log(user);
        if (
          (user.mobile && user.mobile === loginName) ||
          (user.email && user.email === loginName) ||
          (user.login_id && user.login_id === loginName) ||
          (user.loginId && user.loginId === loginName)
        ) {
          result.result = null;
          return res.json(user);
        }
      }

      cursor = result.result.next_cursor ?? null;
    } while (cursor !== null);

    res.json({ message: "User not found" });
  } catch (error) {
    console.error("getUserByLoginName Error:", error);
    throw new Error(`Failed to get user by login name: ${error.message}`); // Re-throw for handling upstream
  }
}

app.post("/getAllDepartment", getAllDepartment);
app.post("/createDingTalkUser", createDingTalkUser);
app.post("/decrypt", decrypt);
app.post("/getUser", getUser);
app.post("/getUserId", getUserId);
app.post("/getStatusUser", getStatusUser);
app.post("/createDepartment", createDepartment);
app.post("/getAllDepartment", getAllDepartment);
app.post("/getDepartment", getDepartment);
app.post("/updateDepartment", updateDepartment);
app.post("/updateUser", updateUser);
app.post("/getUserByLoginName", getUserByLoginName);

app.listen(port, () => {
  console.log(`Server listening on port http://localhost:${port}/`); // Log server start
});
