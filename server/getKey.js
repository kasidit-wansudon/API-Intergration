const { GoogleAuth } = require('google-auth-library');
const path = require('path');

// ระบุ path ไปยังไฟล์ JSON ที่คุณดาวน์โหลดจาก Firebase Console
const keyPath = path.join(__dirname, './keys/oppo-colombia-staff-tools-firebase-adminsdk-tw03d-3cfecba1a4.json');

async function getAccessToken() {
  const auth = new GoogleAuth({
    keyFile: keyPath,
    scopes: ['https://www.googleapis.com/auth/cloud-platform'],
  });

  const client = await auth.getClient();
  const accessToken = await client.getAccessToken();

  console.log('Access Token:', accessToken.token);
}

getAccessToken().catch(console.error);

var token = "ya29.c.c0ASRK0GYOxwI_AaV0xiVFnNstCrKd32Moc5MoSkk_9hNcPuFgmxCPaRsaIDIBluPUTH-SY78APOa5ENYOcMazGu5dc8ZqKYx5vC0wkx5LTV3qJPmWLtnnTfyS0itGPAny8dpYBp9KD-4sv2_SK7chVhOZHnF-Klq9qiRRrZ-qSGiKPpzhMmy82Z5SjL9LVpdG__-4L_643XpNpfb6-SLex1ypk1TH2d3ZHHHIDncmM1KDlqt_YsUJeivMCwkgOmdz03GtNWWtyO6bHhhq7AAcgqfms57dXnsw1tY_TB1H-nBJHZUNlssMMLHnvzIprvFhgLRDbTT9_VS-BN9Y4_uMKbffnJLIO4umSbNbqJJzkZqqjjE4yleGbcngYQG387KiXrkFqQsXh5kRww_gncMqdvooM4iOIW3Vya2pwFsljrI0t4gyOS6Bj2Wc37jbXoorRu5oR_d9ayXO6FQ1BnlvB-gQttdsnuOBB1Jjh4r0mpMvIZWhpuZRWUyZBJ1IV134Y3dr9Vzpk4atZ7otRIZIb7dJvmrVspap1O4Bx4gcs15paUw00hz6rdkkSMRcR2d46973ViQ73csB_fl4IS2b55ikfVYzM6Rxghu_a7QBIscYFRlv4Vw6mkSl_21FYcaOqwmyc8pZrcW4ehnYnisvWsU0Vus8JgIM8IqWf9YsSdB5ytYco-O-xaSFrocFVonmitSbRm2X2h-Qe8Fi3ZQlUvpyo_j6utpmohpOsRUk_rpaoUVSRkpF3Yt_2Fehb-p8Wiy19Q2Ymemj6Ql9bgi8qj-jqu7JQQyg4IjmV7XpjFfJXpS3UqpuJth3kYbZSzI8JB3XpetO4-tUMy-kB9S0yF0RZ9anfOquy-rx9M_-v90Unpkq8q0ro8jX6Wp_szmwF5_XnFxyMsFy0gm_VRIYgZSbR_y_jh9Ug5srxMtp7J2BUwnkpFc96UBfYJuMkipQQbRrr5VlqUMMykcgkhiU31QoW1gFYjt8fjyV1JFiBoh5n-Qx7owaJw3"