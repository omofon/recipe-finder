import { HfInference } from "@huggingface/inference";
import dotenv from "dotenv";
import https from "https";

dotenv.config();

console.log("=== HuggingFace Connection Debugger ===\n");

// 1. Check token exists
console.log("1. Token Check:");
const token = process.env.HF_ACCESS_TOKEN;
if (!token) {
  console.log("❌ No token found in .env file");
  process.exit(1);
}
console.log(
  `✅ Token found: ${token.substring(0, 10)}...${token.substring(token.length - 4)}`,
);
console.log(`   Length: ${token.length} characters\n`);

// 2. Test token validity with direct API call
console.log("2. Testing Token Validity (Direct API):");
const testTokenValidity = () => {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: "huggingface.co",
      path: "/api/whoami-v2",
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    const req = https.request(options, (res) => {
      let data = "";
      res.on("data", (chunk) => (data += chunk));
      res.on("end", () => {
        if (res.statusCode === 200) {
          console.log("✅ Token is VALID");
          console.log("   User info:", JSON.parse(data));
          resolve();
        } else {
          console.log(`❌ Token is INVALID (Status: ${res.statusCode})`);
          console.log("   Response:", data);
          reject(new Error("Invalid token"));
        }
      });
    });

    req.on("error", (e) => {
      console.log("❌ Network error:", e.message);
      reject(e);
    });

    req.end();
  });
};

// 3. Test inference
async function testInference() {
  console.log("\n3. Testing Inference with HfInference library:");
  const hf = new HfInference(token);

  const models = [
    "HuggingFaceH4/zephyr-7b-beta",
    "mistralai/Mistral-7B-Instruct-v0.2",
    "microsoft/Phi-3-mini-4k-instruct",
    "meta-llama/Meta-Llama-3-8B-Instruct",
  ];

  for (const model of models) {
    try {
      console.log(`\n   Testing: ${model}`);
      const result = await hf.chatCompletion({
        model: model,
        messages: [{ role: "user", content: "Say 'test successful'" }],
        max_tokens: 20,
      });
      console.log(`   ✅ SUCCESS with ${model}`);
      console.log(`   Response: ${result.choices[0].message.content}`);
      return; // Stop after first success
    } catch (err) {
      console.log(`   ❌ FAILED with ${model}`);
      console.log(`   Error: ${err.message}`);
      if (err.response) {
        console.log(`   Status: ${err.response.status}`);
        console.log(`   Body:`, await err.response.text());
      }
    }
  }
}

// Run all tests
(async () => {
  try {
    await testTokenValidity();
    await testInference();
  } catch (err) {
    console.log("\n❌ CRITICAL ERROR:", err.message);
    console.log("\nRECOMMENDED ACTIONS:");
    console.log(
      "1. Generate a new token at https://huggingface.co/settings/tokens",
    );
    console.log("2. Make sure it has 'Read' permissions");
    console.log("3. Update your .env file");
    console.log("4. Restart your server");
  }
})();
